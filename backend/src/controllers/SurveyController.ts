import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import Survey from '../models/Survey';
import SurveyResponse from '../models/SurveyResponse';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { LinkedContent } from '../interfaces/LinkedContent';
import { AuthRequest } from '../middleware/auth';

class SurveyController {
  private clients: Map<string, Socket> = new Map();

  public async createSurvey(req: AuthRequest, res: Response) {
    try {
      const surveyRepository = AppDataSource.getRepository(Survey);
      const survey = surveyRepository.create({
        ...req.body,
        creator: req.user!._id
      });
      await surveyRepository.save(survey);
      res.status(201).json(survey);
    } catch (error) {
      res.status(400).json({ message: 'Error creating survey', error });
    }
  }

  public async getSurvey(req: Request, res: Response) {
    try {
      const surveyRepository = AppDataSource.getRepository(Survey);
      const survey = await surveyRepository.findOne({ where: { id: req.params.id } });
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      res.json(survey);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching survey', error });
    }
  }

  public async submitSurveyResponse(req: AuthRequest, res: Response) {
    try {
      const surveyResponseRepository = AppDataSource.getRepository(SurveyResponse);
      const surveyResponse = surveyResponseRepository.create({
        survey: req.params.id,
        respondent: req.user!._id,
        answers: req.body.answers
      });
      await surveyResponseRepository.save(surveyResponse);
      res.status(201).json(surveyResponse);
    } catch (error) {
      res.status(400).json({ message: 'Error submitting survey response', error });
    }
  }

  public async getSurveyResults(req: Request, res: Response) {
    try {
      const surveyResponseRepository = AppDataSource.getRepository(SurveyResponse);
      const results = await surveyResponseRepository.find({ where: { survey: req.params.id } });
      res.json(results);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching survey results', error });
    }
  }

  public async addCollaborator(req: Request, res: Response) {
    try {
      const { surveyId, userId } = req.body;
      const surveyRepository = AppDataSource.getRepository(Survey);
      const survey = await surveyRepository.findOne({ where: { id: surveyId } });
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      
      survey.collaborators.push(userId);
      await surveyRepository.save(survey);
      
      res.status(200).json({ message: 'Collaborator added successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error adding collaborator', error });
    }
  }

  public handleSocket(socket: Socket, surveyId: string) {
    console.log(`New connection for survey ${surveyId}`);
    const clientId = uuidv4();
    this.clients.set(clientId, socket);
    socket.join(`survey:${surveyId}`);

    socket.on('message', (message: string) => {
      this.handleMessage(socket, surveyId, message);
    });

    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  private handleMessage(socket: Socket, surveyId: string, message: string) {
    const data = JSON.parse(message);
    this.handleClientMessage(surveyId, data);
  }

  private handleDisconnect(socket: Socket) {
    this.clients.forEach((client, id) => {
      if (client === socket) {
        this.clients.delete(id);
      }
    });
  }

  private handleClientMessage(surveyId: string, data: any) {
    switch (data.type) {
      case 'update':
        this.updateSurvey(surveyId, data.changes);
        this.broadcastToClients(surveyId, data);
        break;
      case 'cursor':
        this.broadcastToClients(surveyId, data);
        break;
      // Add more cases as needed
    }
  }

  private async updateSurvey(surveyId: string, changes: any) {
    try {
      const surveyRepository = AppDataSource.getRepository(Survey);
      const survey = await surveyRepository.findOne({ where: { id: surveyId } });
      if (!survey) {
        throw new Error('Survey not found');
      }
      surveyRepository.merge(survey, changes);
      await surveyRepository.save(survey);
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  }

  private broadcastToClients(surveyId: string, data: any) {
    const room = `survey:${surveyId}`;
    this.clients.forEach((socket) => {
      socket.to(room).emit('message', data);
    });
  }

  public async linkContent(req: Request, res: Response) {
    try {
      const { surveyId } = req.params;
      const { contentType, contentId, contentTitle } = req.body;

      const surveyRepository = AppDataSource.getRepository(Survey);
      const survey = await surveyRepository.findOne({ where: { id: surveyId } });
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }

      const linkedContent: LinkedContent = {
        type: contentType,
        id: contentId,
        title: contentTitle
      };

      survey.linkedContent.push(linkedContent);
      await surveyRepository.save(survey);

      res.status(200).json({ message: 'Content linked successfully', linkedContent });
    } catch (error) {
      res.status(400).json({ message: 'Error linking content', error });
    }
  }

  public async getLinkedContent(req: Request, res: Response) {
    try {
      const { surveyId } = req.params;
      const surveyRepository = AppDataSource.getRepository(Survey);
      const survey = await surveyRepository.findOne({ 
        where: { id: surveyId },
        select: ['linkedContent']
      });
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      res.status(200).json(survey.linkedContent);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching linked content', error });
    }
  }
}

export default new SurveyController();

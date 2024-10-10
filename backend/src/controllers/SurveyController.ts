import { Request, Response } from 'express';
import Survey, { ISurvey } from '../models/Survey';
import SurveyResponse from '../models/SurveyResponse';
import { WebSocket } from 'uWebSockets.js';
import { v4 as uuidv4 } from 'uuid';
import { LinkedContent } from '../interfaces/LinkedContent';
import { AuthRequest } from '../middleware/auth';

class SurveyController {
  private clients: Map<string, WebSocket> = new Map();

  public async createSurvey(req: AuthRequest, res: Response) {
    try {
      const survey: ISurvey = new Survey({
        ...req.body,
        creator: req.user!._id
      });
      await survey.save();
      res.status(201).json(survey);
    } catch (error) {
      res.status(400).json({ message: 'Error creating survey', error });
    }
  };

  export const getSurvey = async (req: Request, res: Response) => {
    try {
      const survey = await Survey.findById(req.params.id);
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      res.json(survey);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching survey', error });
    }
  };

  export const submitSurveyResponse = async (req: AuthRequest, res: Response) => {
    try {
      const surveyResponse = new SurveyResponse({
        survey: req.params.id,
        respondent: req.user!._id,
        answers: req.body.answers
      });
      await surveyResponse.save();
      res.status(201).json(surveyResponse);
    } catch (error) {
      res.status(400).json({ message: 'Error submitting survey response', error });
    }
  };

  export const getSurveyResults = async (req: Request, res: Response) => {
    try {
      const results = await SurveyResponse.find({ survey: req.params.id });
      res.json(results);
    } catch (error) {
      res.status(400).json({ message: 'Error fetching survey results', error });
    }
  };

  export const addCollaborator = async (req: Request, res: Response) => {
    try {
      const { surveyId, userId } = req.body;
      const survey = await Survey.findById(surveyId);
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      
      survey.collaborators.push(userId);
      await survey.save();
      
      res.status(200).json({ message: 'Collaborator added successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Error adding collaborator', error });
    }
  };

  public handleWebSocket(ws: WebSocket, surveyId: string) {
    const clientId = uuidv4();
    this.clients.set(clientId, ws);
    ws.subscribe(`survey:${surveyId}`);
  }

  public handleMessage(ws: WebSocket, surveyId: string, message: string) {
    const data = JSON.parse(message);
    this.handleClientMessage(surveyId, data);
  }

  public handleDisconnect(ws: WebSocket) {
    this.clients.forEach((client, id) => {
      if (client === ws) {
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
      const survey = await Survey.findById(surveyId);
      if (!survey) {
        throw new Error('Survey not found');
      }
      Object.assign(survey, changes);
      await survey.save();
    } catch (error) {
      console.error('Error updating survey:', error);
    }
  }

  private broadcastToClients(surveyId: string, data: any) {
    const message = JSON.stringify(data);
    this.clients.forEach((client) => {
      client.send(message, true);
    });
  }

  public async linkContent(req: Request, res: Response) {
    try {
      const { surveyId } = req.params;
      const { contentType, contentId, contentTitle } = req.body;

      const survey = await Survey.findById(surveyId);
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }

      const linkedContent: LinkedContent = {
        type: contentType,
        id: contentId,
        title: contentTitle
      };

      survey.linkedContent.push(linkedContent);
      await survey.save();

      res.status(200).json({ message: 'Content linked successfully', linkedContent });
    } catch (error) {
      res.status(400).json({ message: 'Error linking content', error });
    }
  }

  public async getLinkedContent(req: Request, res: Response) {
    try {
      const { surveyId } = req.params;
      const survey = await Survey.findById(surveyId).select('linkedContent');
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
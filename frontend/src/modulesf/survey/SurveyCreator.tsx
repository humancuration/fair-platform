import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSurvey } from '../actions/surveyActions';
import QuestionEditor from './QuestionEditor';
import ConditionLogicEditor from './ConditionLogicEditor';
import SecuritySettings from './SecuritySettings';
import LinkedContentManager from '../../components/LinkedContentManager';

const SurveyCreator: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [survey, setSurvey] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [conditionLogic, setConditionLogic] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({
    isEncrypted: false,
    passwordProtected: false,
    ipRestriction: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    fetchSurvey();
    setupWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [surveyId]);

  const fetchSurvey = async () => {
    // Implement survey fetching logic
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:9001/surveys/${surveyId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleIncomingMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Implement reconnection logic here
    };
  };

  const handleIncomingMessage = (data: any) => {
    switch (data.type) {
      case 'update':
        setSurvey((prevSurvey: any) => ({ ...prevSurvey, ...data.changes }));
        break;
      case 'cursor':
        // Handle cursor updates
        break;
      // Handle other message types
    }
  };

  const handleSurveyChange = (changes: any) => {
    setSurvey((prevSurvey: any) => ({ ...prevSurvey, ...changes }));
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'update', changes }));
    }
  };

  const handleCursorMove = (position: { x: number; y: number }) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'cursor', position }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createSurvey({ title, description, questions, conditionLogic, securitySettings }));
  };

  if (!survey) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6">Create Survey</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded text-xl"
            placeholder="Survey Title"
            required
          />
        </div>
        <div className="mb-6">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Survey Description"
            rows={3}
          ></textarea>
        </div>

        {/* Question Editor */}
        <QuestionEditor questions={questions} setQuestions={setQuestions} />

        {/* Conditional Logic */}
        <ConditionLogicEditor logic={conditionLogic} setLogic={setConditionLogic} questions={questions} />

        {/* Security Settings */}
        <SecuritySettings settings={securitySettings} setSettings={setSecuritySettings} />

        {/* Linked Content Manager */}
        {surveyId && <LinkedContentManager surveyId={surveyId} />}

        <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded text-lg font-semibold mt-6">
          Create Survey
        </button>
      </form>
    </div>
  );
};

export default SurveyCreator;
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSurvey } from '../actions/surveyActions';
import QuestionEditor from './QuestionEditor';
import ConditionLogicEditor from './ConditionLogicEditor';
import SecuritySettings from './SecuritySettings';
import LinkedContentManager from '../../components/LinkedContentManager';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMagic, FaSparkles, FaLock, FaLink } from 'react-icons/fa';
import Lottie from 'react-lottie';
import magicWandAnimation from '../../assets/animations/magic-wand.json';

const EnchantedContainer = styled(motion.div)`
  background: linear-gradient(135deg, #6e48aa, #9d50bb);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  color: #fff;
`;

const MagicalTitle = styled(motion.h2)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const WhimsicalInput = styled(motion.input)`
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 15px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const EnchantedTextarea = styled(WhimsicalInput).attrs({ as: 'textarea' })`
  min-height: 100px;
  resize: vertical;
`;

const MagicalButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  border-radius: 25px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

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
    return (
      <EnchantedContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Lottie 
          options={{
            loop: true,
            autoplay: true, 
            animationData: magicWandAnimation,
          }}
          height={200}
          width={200}
        />
        <MagicalTitle>Conjuring your magical survey...</MagicalTitle>
      </EnchantedContainer>
    );
  }

  return (
    <EnchantedContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <MagicalTitle
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        <FaMagic /> Craft Your Enchanted Survey
      </MagicalTitle>
      <form onSubmit={handleSubmit}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <WhimsicalInput
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your magical survey title"
              required
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EnchantedTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your enchanted survey"
              rows={3}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <QuestionEditor questions={questions} setQuestions={setQuestions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ConditionLogicEditor logic={conditionLogic} setLogic={setConditionLogic} questions={questions} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SecuritySettings settings={securitySettings} setSettings={setSecuritySettings} />
          </motion.div>

          {surveyId && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <LinkedContentManager surveyId={surveyId} />
            </motion.div>
          )}

          <MagicalButton
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSparkles /> Conjure Survey
          </MagicalButton>
        </AnimatePresence>
      </form>
    </EnchantedContainer>
  );
};

export default SurveyCreator;

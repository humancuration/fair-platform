import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import api from '@/utils/api';
import './PollWidget.css';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
}

const PollWidget: React.FC = () => {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  useEffect(() => {
    const fetchPollData = async () => {
      try {
        const response = await api.get<PollData>('/polls/current');
        setPollData(response.data);
      } catch (err) {
        setError('Failed to load poll data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPollData();
  }, []);

  const handleVote = async (optionId: string) => {
    if (hasVoted) return;
    
    setSelectedOption(optionId);
    
    try {
      await api.post(`/polls/vote/${optionId}`);
      setHasVoted(true);
      
      // Update local vote count
      if (pollData) {
        const updatedOptions = pollData.options.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        setPollData({
          ...pollData,
          options: updatedOptions,
          totalVotes: pollData.totalVotes + 1
        });
      }

      // Create confetti effect
      createConfetti();
    } catch (err) {
      setError('Failed to submit your vote.');
    }
  };

  const createConfetti = () => {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;
      document.querySelector('.poll-widget')?.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1000);
    }
  };

  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  const particlesConfig = {
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      opacity: {
        value: 0.5,
        random: true
      },
      size: {
        value: 3,
        random: true
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        out_mode: "out"
      }
    }
  };

  if (loading) {
    return (
      <div className="poll-widget loading-animation">
        <div className="loading-dot" />
        <div className="loading-dot" />
        <div className="loading-dot" />
      </div>
    );
  }

  if (error) return <div className="poll-widget error">{error}</div>;
  if (!pollData) return null;

  const calculatePercentage = (votes: number) => {
    return ((votes / pollData.totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="poll-widget-container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesConfig}
        className="particles-background"
      />
      
      <Canvas className="three-background">
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0} 
          fade 
        />
      </Canvas>

      <motion.div 
        className="poll-widget"
        initial={{ opacity: 0, y: 20, rotateX: -20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 100 
        }}
      >
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {pollData.question}
        </motion.h2>

        <AnimatePresence>
          {pollData.options.map((option) => (
            <motion.div
              key={option.id}
              className={`poll-option ${selectedOption === option.id ? 'selected' : ''} ${hasVoted ? 'voted' : ''}`}
              onClick={() => handleVote(option.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={!hasVoted ? { scale: 1.02 } : {}}
              whileTap={!hasVoted ? { scale: 0.98 } : {}}
            >
              <div className="option-text">{option.text}</div>
              {hasVoted && (
                <>
                  <div 
                    className="progress-bar"
                    style={{ width: `${calculatePercentage(option.votes)}%` }}
                  />
                  <div className="percent">{calculatePercentage(option.votes)}%</div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {hasVoted && (
          <motion.div 
            className="total-votes"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Total votes: {pollData.totalVotes}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PollWidget;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { FaHeart, FaSmile, FaHandSparkles, FaComments, FaUsers, FaVolumeUp, FaMusic } from 'react-icons/fa';
import { 
  FloatingReaction, 
  reactionVariants, 
  gestureVariants, 
  groupDanceVariants,
  ParticleEffect,
  createParticles 
} from './animations/ReactionAnimations';

interface NearbyListener {
  id: string;
  username: string;
  avatar: string;
  position?: { x: number; y: number }; // Add this line
  currentTrack?: {
    title: string;
    artist: string;
  };
  mood?: string;
  favoriteGenres: string[];
  isOnline: boolean;
}

interface SocialZone {
  id: string;
  name: string;
  type: 'chill' | 'dance' | 'social' | 'performance';
  position: { x: number; y: number }; // Add this line
  currentActivity?: {
    type: 'listening_party' | 'live_performance' | 'dj_set' | 'casual';
    hostId: string;
    participants: number;
  };
  capacity: number;
  currentOccupants: number;
}

interface Reaction {
  id: string;
  type: keyof typeof reactionVariants; // This ensures type safety
  position: { x: number; y: number };
  userId: string;
  username: string;
  timestamp: number;
}

interface ProximityChat {
  id: string;
  userId: string;
  username: string;
  message: string;
  position: { x: number; y: number };
  range: number; // Chat visibility radius
}

interface VirtualGesture {
  id: string;
  type: 'wave' | 'dance' | 'jump' | 'clap';
  userId: string;
  username: string;
  position: { x: number; y: number };
  duration: number;
  variant: typeof gestureVariants[keyof typeof gestureVariants];
}

const ReactionBubble = styled(motion.div)`
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const GestureAnimation = styled(motion.div)`
  position: absolute;
  pointer-events: none;
`;

const ProximityChatBubble = styled(motion.div)<{ range: number }>`
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  padding: 8px 12px;
  max-width: 200px;
  pointer-events: none;
  opacity: ${props => props.range};
`;

const VenueContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const NearbySection = styled.section`
  padding: 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
`;

const ListenerCard = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActiveZonesSection = styled.section`
  padding: 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
  margin: 1rem 0;
`;

const AICompanionSection = styled.section`
  padding: 1rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
`;

const SuggestionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Suggestion = styled.li`
  margin: 0.5rem 0;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const NearbyUsersIndicator = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const AudioZoneIndicator = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const ActivityBadge = styled.span`
  background-color: #4CAF50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

const JoinButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #666;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #555;
  }
`;

const ZoneCard = styled.div`
  padding: 1rem;
  margin: 0.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const getReactionColor = (type: keyof typeof reactionVariants): string => {
  const colors = {
    heart: '#ff6b6b',
    bounce: '#4ecdc4', 
    spiral: '#ffe66d',
    wave: '#95e1d3'
  };
  return colors[type] || '#ffffff';
};

const VenueSocialSpace: React.FC = () => {
  const [nearbyListeners, setNearbyListeners] = useState<NearbyListener[]>([]);
  const [activeZones, setActiveZones] = useState<SocialZone[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [gestures, setGestures] = useState<VirtualGesture[]>([]);
  const [proximityChats, setProximityChats] = useState<ProximityChat[]>([]);
  const [userPosition, setUserPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [nearbyUsers, setNearbyUsers] = useState<NearbyListener[]>([]);
  const [audioZones, setAudioZones] = useState<SocialZone[]>([]);
  const [reactionParticles, setReactionParticles] = useState<any[]>([]);
  const [groupDancers, setGroupDancers] = useState<NearbyListener[]>([]);
  const [suggestions, setSuggestions] = useState<Array<{text: string}>>([
    { text: "There's a listening party for Jazz music starting in the Chill Zone!" },
    { text: "3 people nearby share your love for Artist XX" }
  ]);
  const { user } = useAuth();
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      // Real-time reaction handling
      socket.on('reaction_added', (reaction: Reaction) => {
        setReactions(prev => [...prev, reaction]);
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== reaction.id));
        }, 3000);
      });

      // Real-time gesture handling
      socket.on('gesture_performed', (gesture: VirtualGesture) => {
        setGestures(prev => [...prev, gesture]);
        setTimeout(() => {
          setGestures(prev => prev.filter(g => g.id !== gesture.id));
        }, gesture.duration);
      });

      // Proximity chat updates
      socket.on('proximity_message', (chat: ProximityChat) => {
        const distance = calculateDistance(userPosition, chat.position);
        if (distance <= chat.range) {
          setProximityChats(prev => [...prev, chat]);
          setTimeout(() => {
            setProximityChats(prev => prev.filter(c => c.id !== chat.id));
          }, 5000);
        }
      });

      // Nearby users updates
      socket.on('nearby_users_update', (users: NearbyListener[]) => {
        setNearbyUsers(users);
      });

      // Audio zone updates
      socket.on('audio_zones_update', (zones: SocialZone[]) => {
        setAudioZones(zones);
        updateAudioLevels(zones);
      });
    }

    return () => {
      if (socket) {
        socket.off('reaction_added');
        socket.off('gesture_performed');
        socket.off('proximity_message');
        socket.off('nearby_users_update');
        socket.off('audio_zones_update');
      }
    };
  }, [socket, userPosition]);

  const handleReaction = (type: string, position: { x: number, y: number }) => {
    const newReaction: Reaction = {
      id: Math.random().toString(),
      // Update type to match available variants
      type: type as keyof typeof reactionVariants, // Match reactionVariants
      position,
      userId: user!.id,
      username: user!.username,
      timestamp: Date.now()
    };

    // 2. Use FloatingReaction component with proper variants
    setReactions(prev => [...prev, newReaction]);
    
    // 3. Add particle effects with proper color
    const reactionColors = {
      heart: '#ff6b6b',
      bounce: '#4ecdc4',
      spiral: '#ffe66d',
      wave: '#95e1d3'
    };
    setReactionParticles(createParticles(12, position));

    // Remove after animation completes
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
      setReactionParticles([]);
    }, 2000);
  };

  const handleGesture = (type: string, position: { x: number, y: number }) => {
    const newGesture: VirtualGesture = {
      id: Math.random().toString(),
      type: type as 'wave' | 'dance' | 'jump' | 'clap',
      userId: user!.id,
      username: user!.username,
      position,
      duration: 2000,
      variant: gestureVariants[type as keyof typeof gestureVariants]
    };

    setGestures(prev => [...prev, newGesture]);

    // For group gestures, create a circle of dancing avatars
    if (type === 'dance') {
      const dancers = nearbyUsers.slice(0, 6).map((user, index) => ({
        ...user,
        position: {
          x: position.x + Math.cos(index * Math.PI / 3) * 50,
          y: position.y + Math.sin(index * Math.PI / 3) * 50
        }
      }));
      
      setGroupDancers(dancers);
      
      // Remove group dance after duration
      setTimeout(() => {
        setGroupDancers([]);
      }, 5000);
    }

    // Remove individual gesture after animation
    setTimeout(() => {
      setGestures(prev => prev.filter(g => g.id !== newGesture.id));
    }, 2000);
  };

  const sendProximityMessage = (message: string) => {
    if (socket) {
      const chat: Omit<ProximityChat, 'id'> = {
        userId: user!.id,
        username: user!.username,
        message,
        position: userPosition,
        range: 50 // 50 units radius
      };
      socket.emit('send_proximity_message', chat);
    }
  };

  const updatePosition = (newPosition: { x: number; y: number }) => {
    setUserPosition(newPosition);
    if (socket) {
      socket.emit('update_position', {
        userId: user!.id,
        position: newPosition
      });
    }
  };

  const updateAudioLevels = (zones: SocialZone[]) => {
    zones.forEach(zone => {
      const distance = calculateDistance(userPosition, zone.position);
      const volume = calculateVolumeByDistance(distance, zone);
      // Update audio levels for this zone
      if (zone.currentActivity?.type === 'dj_set' || zone.currentActivity?.type === 'live_performance') {
        adjustZoneVolume(zone.id, volume);
      }
    });
  };

  const calculateDistance = (pos1: { x: number; y: number }, pos2: { x: number; y: number }) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const calculateVolumeByDistance = (distance: number, zone: SocialZone) => {
    const maxDistance = 100; // Maximum hearing distance
    if (distance > maxDistance) return 0;
    return 1 - (distance / maxDistance);
  };

  const adjustZoneVolume = (zoneId: string, volume: number) => {
    // Implement audio volume adjustment logic
  };

  const joinZone = (zoneId: string) => {
    if (socket) {
      socket.emit('join_zone', {
        userId: user!.id,
        zoneId
      });
    }
  };

  return (
    <VenueContainer>
      <NearbySection>
        <h3>Nearby Music Lovers</h3>
        {nearbyListeners.map(listener => (
          <ListenerCard key={listener.id}>
            {/* Listener info & interaction options */}
          </ListenerCard>
        ))}
      </NearbySection>

      <ActiveZonesSection>
        <h3>Active Spaces</h3>
        {activeZones.map(zone => (
          <ZoneCard key={zone.id}>
            <h4>{zone.name}</h4>
            <p>{zone.currentOccupants}/{zone.capacity} people</p>
            {zone.currentActivity && (
              <ActivityBadge>
                {zone.currentActivity.type === 'listening_party' && '🎧 Listening Party'}
                {zone.currentActivity.type === 'live_performance' && '🎸 Live Performance'}
                {zone.currentActivity.type === 'dj_set' && '🎵 DJ Set'}
              </ActivityBadge>
            )}
            <JoinButton onClick={() => joinZone(zone.id)}>
              Join Space
            </JoinButton>
          </ZoneCard>
        ))}
      </ActiveZonesSection>

      <AICompanionSection>
        <h3>Your AI Guide</h3>
        <p>Suggestions based on the current vibe:</p>
        <SuggestionList>
          {suggestions.map((suggestion, index) => (
            <Suggestion key={index}>
              {suggestion.text}
            </Suggestion>
          ))}
        </SuggestionList>
      </AICompanionSection>

      {/* Real-time reactions */}
      <AnimatePresence>
        {reactions.map(reaction => (
          <FloatingReaction
            key={reaction.id}
            style={{ left: reaction.position.x, top: reaction.position.y }}
            variants={reactionVariants[reaction.type]} // Correctly use the variant
            initial="initial"
            animate="animate"
          >
            {/* Update emoji mapping to match available types */}
            {reaction.type === 'heart' && '❤️'}
            {reaction.type === 'bounce' && '🎵'}
            {reaction.type === 'spiral' && '✨'}
            {reaction.type === 'wave' && '👋'}
          </FloatingReaction>
        ))}

        {/* Particle Effects */}
        {reactionParticles.map(particle => (
          <ParticleEffect
            key={particle.id}
            initial={particle.initial}
            animate={particle.animate}
            transition={particle.transition}
            color={getReactionColor(particle.type)} // Use particle.type instead of reaction.type
          />
        ))}

        {/* Gestures */}
        {gestures.map(gesture => (
          <motion.div
            key={gesture.id}
            style={{ 
              position: 'absolute', 
              left: gesture.position.x, 
              top: gesture.position.y 
            }}
            variants={gesture.variant}
            initial="initial"
            animate="animate"
          >
            <Avatar src={user?.avatar} alt="User Avatar" />
          </motion.div>
        ))}

        {/* Group Dances */}
        {groupDancers.map((dancer, index) => (
          <motion.div
            key={dancer.id}
            style={{ 
              position: 'absolute', 
              left: dancer.position?.x ?? 0, // Add nullish coalescing
              top: dancer.position?.y ?? 0,  // Add nullish coalescing
            }}
            variants={groupDanceVariants.circle}
            initial="initial"
            animate="animate"
            custom={index}
          >
            <Avatar src={dancer.avatar} alt={dancer.username} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Proximity chat */}
      <AnimatePresence>
        {proximityChats.map(chat => (
          <ProximityChatBubble
            key={chat.id}
            range={1 - (calculateDistance(userPosition, chat.position) / chat.range)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ left: chat.position.x, top: chat.position.y }}
          >
            <strong>{chat.username}:</strong> {chat.message}
          </ProximityChatBubble>
        ))}
      </AnimatePresence>

      {/* Quick action buttons */}
      <ActionButtons>
        <ActionButton onClick={() => handleReaction('heart', { x: 100, y: 100 })}>
          <FaHeart /> React
        </ActionButton>
        <ActionButton onClick={() => handleGesture('dance', { x: 200, y: 200 })}>
          <FaMusic /> Dance
        </ActionButton>
        <ActionButton onClick={() => handleGesture('wave', { x: 300, y: 300 })}>
          <FaHandSparkles /> Wave
        </ActionButton>
      </ActionButtons>

      {/* Nearby users indicator */}
      <NearbyUsersIndicator>
        <FaUsers /> {nearbyUsers.length} nearby
      </NearbyUsersIndicator>

      {/* Audio zone indicator */}
      {audioZones.map(zone => (
        <AudioZoneIndicator
          key={zone.id}
          style={{
            opacity: calculateVolumeByDistance(
              calculateDistance(userPosition, zone.position),
              zone
            )
          }}
        >
          <FaVolumeUp /> {zone.name}
        </AudioZoneIndicator>
      ))}
    </VenueContainer>
  );
};

export default VenueSocialSpace;

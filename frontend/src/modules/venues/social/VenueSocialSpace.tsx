import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { useWebSocket } from '../../../hooks/useWebSocket';

interface NearbyListener {
  id: string;
  username: string;
  avatar: string;
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
  currentActivity?: {
    type: 'listening_party' | 'live_performance' | 'dj_set' | 'casual';
    hostId: string;
    participants: number;
  };
  capacity: number;
  currentOccupants: number;
}

const VenueSocialSpace: React.FC = () => {
  const [nearbyListeners, setNearbyListeners] = useState<NearbyListener[]>([]);
  const [activeZones, setActiveZones] = useState<SocialZone[]>([]);
  const { user } = useAuth();
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      // Listen for nearby users updates
      socket.on('nearby_listeners', (listeners: NearbyListener[]) => {
        setNearbyListeners(listeners);
      });

      // Listen for zone activity updates
      socket.on('zone_update', (zones: SocialZone[]) => {
        setActiveZones(zones);
      });

      // Share your current position/activity
      socket.emit('update_location', {
        userId: user?.id,
        position: [0, 0, 0], // Your current position in the venue
        activity: 'exploring'
      });
    }
  }, [socket]);

  const startListeningParty = async (zoneId: string) => {
    try {
      await socket?.emit('create_listening_party', {
        zoneId,
        hostId: user?.id,
        playlist: 'current_playlist_id'
      });
      toast.success('Started a listening party! Others can now join.');
    } catch (error) {
      console.error('Failed to start listening party:', error);
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
          {/* AI-powered suggestions for social interactions */}
          <Suggestion>
            "There's a listening party for {genre} music starting in the Chill Zone!"
          </Suggestion>
          <Suggestion>
            "3 people nearby share your love for {artist}"
          </Suggestion>
        </SuggestionList>
      </AICompanionSection>
    </VenueContainer>
  );
};

export default VenueSocialSpace;

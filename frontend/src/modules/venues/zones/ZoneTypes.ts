import { Vector3 } from 'three';

export type ZoneType = 
  | 'chill'
  | 'energetic' 
  | 'mystical'
  | 'nature'
  | 'urban'
  | 'cosmic'
  | 'fusion'
  | 'experimental';

export interface CrowdAgent {
  id: string;
  position: Vector3;
  velocity: Vector3;
  mood: {
    energy: number;
    happiness: number;
    sociability: number;
  };
  preferences: {
    favoriteGenres: string[];
    crowdTolerance: number;
    explorationDrive: number;
  };
  currentZone: string | null;
  group: string | null;
}

export interface ZoneDefinition {
  type: ZoneType;
  name: string;
  description: string;
  capacity: {
    optimal: number;
    maximum: number;
  };
  musicStyles: string[];
  environmentalEffects: {
    particles: string[];
    lighting: string[];
    weather: string[];
  };
  crowdBehavior: {
    danceability: number;
    socialInteraction: number;
    flowPatterns: string[];
  };
  transitions: {
    compatibleZones: ZoneType[];
    blendFactor: number;
  };
}

export const ZoneTypes: Record<ZoneType, ZoneDefinition> = {
  chill: {
    type: 'chill',
    name: 'Chill Garden',
    description: 'A serene space with ambient sounds and gentle lighting',
    capacity: {
      optimal: 200,
      maximum: 300
    },
    musicStyles: ['ambient', 'downtempo', 'lofi', 'acoustic'],
    environmentalEffects: {
      particles: ['fireflies', 'leaves', 'mist'],
      lighting: ['moonlight', 'lanterns', 'stars'],
      weather: ['gentle-breeze', 'light-rain']
    },
    crowdBehavior: {
      danceability: 0.3,
      socialInteraction: 0.7,
      flowPatterns: ['meandering', 'stationary-groups']
    },
    transitions: {
      compatibleZones: ['nature', 'mystical', 'cosmic'],
      blendFactor: 0.8
    }
  },

  energetic: {
    type: 'energetic',
    name: 'Power Arena',
    description: 'High-energy zone with dynamic lighting and effects',
    capacity: {
      optimal: 500,
      maximum: 1000
    },
    musicStyles: ['edm', 'house', 'techno', 'drum-and-bass'],
    environmentalEffects: {
      particles: ['sparks', 'lasers', 'strobes'],
      lighting: ['dynamic-rgb', 'spotlights', 'led-walls'],
      weather: ['energy-storm', 'heat-waves']
    },
    crowdBehavior: {
      danceability: 0.9,
      socialInteraction: 0.5,
      flowPatterns: ['wave-motion', 'mosh-pit', 'circle-dance']
    },
    transitions: {
      compatibleZones: ['urban', 'experimental', 'fusion'],
      blendFactor: 0.6
    }
  },

  // Add more zone types...
};

export class CrowdSimulation {
  private agents: CrowdAgent[] = [];
  private zones: Map<string, ZoneDefinition> = new Map();
  private socialGroups: Map<string, CrowdAgent[]> = new Map();

  constructor(initialAgents: number) {
    this.initializeAgents(initialAgents);
  }

  private initializeAgents(count: number) {
    for (let i = 0; i < count; i++) {
      this.agents.push(this.createAgent());
    }
  }

  private createAgent(): CrowdAgent {
    return {
      id: Math.random().toString(36).substr(2, 9),
      position: new Vector3(
        Math.random() * 100 - 50,
        0,
        Math.random() * 100 - 50
      ),
      velocity: new Vector3(),
      mood: {
        energy: Math.random(),
        happiness: Math.random(),
        sociability: Math.random()
      },
      preferences: {
        favoriteGenres: this.getRandomGenres(),
        crowdTolerance: Math.random(),
        explorationDrive: Math.random()
      },
      currentZone: null,
      group: null
    };
  }

  private getRandomGenres(): string[] {
    const allGenres = ['electronic', 'ambient', 'rock', 'jazz', 'classical', 'world'];
    const count = Math.floor(Math.random() * 3) + 1;
    return shuffleArray(allGenres).slice(0, count);
  }

  public update(deltaTime: number) {
    this.updateAgentBehaviors(deltaTime);
    this.updateSocialGroups();
    this.updateZoneEffects();
  }

  private updateAgentBehaviors(deltaTime: number) {
    this.agents.forEach(agent => {
      // Update agent position based on various factors
      const targetPosition = this.calculateTargetPosition(agent);
      const steering = this.calculateSteering(agent, targetPosition);
      
      // Apply forces
      agent.velocity.add(steering.multiplyScalar(deltaTime));
      agent.position.add(agent.velocity.multiplyScalar(deltaTime));

      // Update mood based on surroundings
      this.updateAgentMood(agent);
    });
  }

  private calculateTargetPosition(agent: CrowdAgent): Vector3 {
    const position = new Vector3();

    // Consider multiple factors for movement
    const factors = [
      this.getMusicAttraction(agent),
      this.getSocialAttraction(agent),
      this.getPersonalSpaceRepulsion(agent),
      this.getZonePreference(agent)
    ];

    factors.forEach(factor => position.add(factor));
    return position.normalize();
  }

  private updateAgentMood(agent: CrowdAgent) {
    const nearbyAgents = this.getNearbyAgents(agent, 5);
    const currentZone = this.zones.get(agent.currentZone || '');
    
    if (currentZone) {
      // Update mood based on zone compatibility
      const zoneCompatibility = this.calculateZoneCompatibility(agent, currentZone);
      agent.mood.happiness += (zoneCompatibility - 0.5) * 0.1;
      
      // Update energy based on zone type
      const targetEnergy = currentZone.crowdBehavior.danceability;
      agent.mood.energy += (targetEnergy - agent.mood.energy) * 0.1;
    }

    // Social influence on mood
    if (nearbyAgents.length > 0) {
      const averageMood = this.calculateAverageMood(nearbyAgents);
      agent.mood.happiness += (averageMood.happiness - agent.mood.happiness) * 0.05;
      agent.mood.energy += (averageMood.energy - agent.mood.energy) * 0.05;
    }

    // Clamp values
    Object.keys(agent.mood).forEach(key => {
      agent.mood[key as keyof typeof agent.mood] = 
        Math.max(0, Math.min(1, agent.mood[key as keyof typeof agent.mood]));
    });
  }

  private updateSocialGroups() {
    // Form and update social groups based on proximity and compatibility
    this.agents.forEach(agent => {
      if (!agent.group) {
        const nearbyAgents = this.getNearbyAgents(agent, 3);
        const compatibleAgents = nearbyAgents.filter(
          nearby => this.calculateSocialCompatibility(agent, nearby) > 0.7
        );

        if (compatibleAgents.length >= 2) {
          const groupId = Math.random().toString(36).substr(2, 9);
          compatibleAgents.forEach(member => member.group = groupId);
          this.socialGroups.set(groupId, compatibleAgents);
        }
      }
    });
  }

  private updateZoneEffects() {
    // Update environmental effects based on crowd density and mood
    this.zones.forEach((zone, zoneId) => {
      const agentsInZone = this.agents.filter(a => a.currentZone === zoneId);
      const averageMood = this.calculateAverageMood(agentsInZone);
      
      // Emit zone update event with new parameters
      this.emitZoneUpdate(zoneId, {
        crowdDensity: agentsInZone.length / zone.capacity.optimal,
        averageMood,
        dominantGenres: this.calculateDominantGenres(agentsInZone)
      });
    });
  }
}

function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

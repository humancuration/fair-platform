import { PerformanceSpace } from '../terrain/performanceSpaces';

interface AcousticProperties {
  reverberation: number;      // 0-1: Echo/reflection intensity
  absorption: number;         // 0-1: Sound absorption by materials
  diffusion: number;         // 0-1: Sound scattering
  resonance: {
    low: number;             // Bass response
    mid: number;             // Mid frequencies
    high: number;            // High frequencies
  };
  spatialEffects: {
    width: number;           // Stereo field width
    depth: number;           // Front-to-back perception
    height: number;          // Vertical sound distribution
  };
  roomModes: {              // Standing wave frequencies
    axial: number[];
    tangential: number[];
    oblique: number[];
  };
}

interface CrowdDynamics {
  density: number;           // People per square meter
  distribution: number[];    // Crowd positioning array
  movement: number;          // 0-1: Crowd movement intensity
  absorption: number;        // Sound absorption by audience
}

interface EnvironmentalFactors {
  temperature: number;       // Celsius
  humidity: number;         // Percentage
  windSpeed: number;        // m/s
  pressure: number;         // hPa
}

class AcousticSimulation {
  private space: PerformanceSpace;
  private acousticProperties: AcousticProperties;
  private crowdDynamics: CrowdDynamics;
  private environmental: EnvironmentalFactors;

  constructor(space: PerformanceSpace) {
    this.space = space;
    this.acousticProperties = this.initializeAcoustics();
    this.crowdDynamics = this.initializeCrowdDynamics();
    this.environmental = this.initializeEnvironmental();
  }

  private initializeAcoustics(): AcousticProperties {
    // Calculate base acoustic properties based on venue type and materials
    const baseReverberation = this.calculateBaseReverberation();
    const baseAbsorption = this.calculateMaterialAbsorption();

    return {
      reverberation: baseReverberation,
      absorption: baseAbsorption,
      diffusion: this.calculateDiffusion(),
      resonance: {
        low: this.calculateFrequencyResponse(20, 250),
        mid: this.calculateFrequencyResponse(250, 2000),
        high: this.calculateFrequencyResponse(2000, 20000)
      },
      spatialEffects: {
        width: this.calculateSpatialWidth(),
        depth: this.calculateSpatialDepth(),
        height: this.calculateSpatialHeight()
      },
      roomModes: this.calculateRoomModes()
    };
  }

  private calculateBaseReverberation(): number {
    const volume = this.calculateRoomVolume();
    const surfaceArea = this.calculateSurfaceArea();
    const materialFactor = this.getMaterialAbsorptionCoefficient();

    // Sabine's reverberation formula
    return 0.161 * volume / (surfaceArea * materialFactor);
  }

  private calculateMaterialAbsorption(): number {
    // Different materials have different absorption coefficients
    const materials = {
      wood: 0.15,
      concrete: 0.02,
      carpet: 0.3,
      glass: 0.05,
      audience: 0.6
    };

    // Weight based on surface area of each material
    let totalAbsorption = 0;
    let totalArea = 0;

    Object.entries(materials).forEach(([material, coefficient]) => {
      const area = this.getMaterialArea(material);
      totalAbsorption += area * coefficient;
      totalArea += area;
    });

    return totalAbsorption / totalArea;
  }

  private calculateFrequencyResponse(minHz: number, maxHz: number): number {
    // Consider room geometry and materials for frequency-specific response
    const roomResonances = this.calculateRoomModes();
    const materialResponse = this.getMaterialFrequencyResponse(minHz, maxHz);
    
    return (roomResonances.axial.length + materialResponse) / 2;
  }

  public simulateAcoustics(position: [number, number, number], frequency: number): number {
    // Calculate sound intensity at given position and frequency
    const distance = this.calculateDistance(position);
    const attenuation = this.calculateAttenuation(distance);
    const reverb = this.calculateReverbAtPosition(position);
    const crowdEffect = this.calculateCrowdEffect(position);
    const environmentalEffect = this.calculateEnvironmentalEffect();

    return this.combineFactor(
      attenuation,
      reverb,
      crowdEffect,
      environmentalEffect
    );
  }

  public updateCrowdDynamics(newDensity: number, newDistribution: number[]): void {
    this.crowdDynamics.density = newDensity;
    this.crowdDynamics.distribution = newDistribution;
    this.updateAcousticProperties();
  }

  private calculateCrowdEffect(position: [number, number, number]): number {
    const localDensity = this.getLocalCrowdDensity(position);
    const absorption = this.crowdDynamics.absorption * localDensity;
    const diffusion = this.calculateCrowdDiffusion(localDensity);
    
    return 1 - (absorption + diffusion) / 2;
  }

  private getLocalCrowdDensity(position: [number, number, number]): number {
    // Calculate crowd density in the vicinity of the given position
    const radius = 5; // meters
    const nearbyPeople = this.crowdDynamics.distribution.filter(
      pos => this.calculateDistance(pos as [number, number, number]) < radius
    ).length;

    return nearbyPeople / (Math.PI * radius * radius);
  }

  private updateAcousticProperties(): void {
    // Update acoustic properties based on current conditions
    const crowdAbsorption = this.crowdDynamics.density * 0.6;
    const newReverberation = this.acousticProperties.reverberation * (1 - crowdAbsorption);
    
    this.acousticProperties.reverberation = newReverberation;
    this.acousticProperties.diffusion = this.calculateDiffusion();
  }

  public getOptimalSoundSetup(): {
    speakerPositions: [number, number, number][];
    equalizerSettings: { frequency: number; gain: number }[];
    delayTimes: number[];
  } {
    // Calculate optimal sound system configuration
    return {
      speakerPositions: this.calculateOptimalSpeakerPositions(),
      equalizerSettings: this.calculateOptimalEQ(),
      delayTimes: this.calculateDelayTimes()
    };
  }

  private calculateOptimalSpeakerPositions(): [number, number, number][] {
    // Use room geometry and crowd distribution to determine optimal speaker placement
    const positions: [number, number, number][] = [];
    const coverage = this.calculateCoverageMap();
    
    // Find local maxima in coverage map for speaker positions
    coverage.forEach((row, y) => {
      row.forEach((value, x) => {
        if (this.isLocalMaximum(coverage, x, y)) {
          const height = this.calculateOptimalHeight(x, y);
          positions.push([x, height, y]);
        }
      });
    });

    return positions;
  }

  private calculateOptimalEQ(): { frequency: number; gain: number }[] {
    // Calculate frequency response compensation based on room acoustics
    const frequencies = [63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
    return frequencies.map(freq => ({
      frequency: freq,
      gain: this.calculateRequiredGain(freq)
    }));
  }

  public getRealTimeAcoustics(position: [number, number, number]): {
    intensity: number;
    frequency: { low: number; mid: number; high: number };
    reverb: number;
    clarity: number;
  } {
    return {
      intensity: this.calculateSoundIntensity(position),
      frequency: {
        low: this.acousticProperties.resonance.low,
        mid: this.acousticProperties.resonance.mid,
        high: this.acousticProperties.resonance.high
      },
      reverb: this.calculateReverbAtPosition(position),
      clarity: this.calculateClarity(position)
    };
  }
}

export default AcousticSimulation;

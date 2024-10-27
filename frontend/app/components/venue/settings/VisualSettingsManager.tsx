import { create } from 'zustand';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

interface VisualSettings {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  style: {
    shader: 'default' | 'toon' | 'neon' | 'psychedelic' | 'retro' | 'vaporwave';
    postProcessing: {
      bloom: boolean;
      glitch: boolean;
      chromaticAberration: boolean;
      filmGrain: boolean;
    };
    particleDensity: number;
    lightingQuality: 'basic' | 'advanced' | 'raytraced';
  };
  performance: {
    maxParticles: number;
    shadowQuality: 'off' | 'low' | 'medium' | 'high';
    antiAliasing: 'none' | 'FXAA' | 'SMAA' | 'MSAA';
    reflections: boolean;
    crowdDensity: number;
  };
  experimental: {
    enableVolumetrics: boolean;
    useCustomShaders: boolean;
    shaderPacks: string[];
  };
}

const useVisualSettings = create<{
  settings: VisualSettings;
  updateSettings: (settings: Partial<VisualSettings>) => void;
}>((set) => ({
  settings: {
    quality: 'medium',
    style: {
      shader: 'default',
      postProcessing: {
        bloom: true,
        glitch: false,
        chromaticAberration: false,
        filmGrain: false
      },
      particleDensity: 1.0,
      lightingQuality: 'advanced'
    },
    performance: {
      maxParticles: 10000,
      shadowQuality: 'medium',
      antiAliasing: 'FXAA',
      reflections: true,
      crowdDensity: 1.0
    },
    experimental: {
      enableVolumetrics: false,
      useCustomShaders: false,
      shaderPacks: []
    }
  },
  updateSettings: (newSettings) => 
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
}));

export function VisualSettingsPanel() {
  const { settings, updateSettings } = useVisualSettings();

  return (
    <motion.div 
      className="fixed right-6 top-6 bg-black/80 backdrop-blur-lg rounded-xl p-6 text-white"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h2 className="text-xl font-bold mb-4">Visual Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg mb-2">Style</h3>
          <select 
            value={settings.style.shader}
            onChange={(e) => updateSettings({ 
              style: { ...settings.style, shader: e.target.value as VisualSettings['style']['shader'] }
            })}
            className="bg-white/10 rounded px-2 py-1"
          >
            <option value="default">Default</option>
            <option value="neon">Neon Nights</option>
            <option value="psychedelic">Psychedelic</option>
            <option value="vaporwave">Vaporwave</option>
            <option value="retro">Retro</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg mb-2">Post Processing</h3>
          <div className="space-y-2">
            {Object.entries(settings.style.postProcessing).map(([effect, enabled]) => (
              <label key={effect} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => updateSettings({
                    style: {
                      ...settings.style,
                      postProcessing: {
                        ...settings.style.postProcessing,
                        [effect]: !enabled
                      }
                    }
                  })}
                />
                {effect.charAt(0).toUpperCase() + effect.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-2">Performance</h3>
          <select 
            value={settings.quality}
            onChange={(e) => updateSettings({ quality: e.target.value as VisualSettings['quality'] })}
            className="bg-white/10 rounded px-2 py-1"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="ultra">Ultra</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}

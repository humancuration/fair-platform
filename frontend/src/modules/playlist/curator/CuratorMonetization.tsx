import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCoins, FaChartLine, FaHandshake, FaMusic, FaHeart, FaStar, FaUserShield, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface EarningMetrics {
  totalEarned: number;
  listenerMinutes: number;
  uniqueListeners: number;
  artistSupport: {
    directSupport: number;
    streamingRoyalties: number;
    merchandiseSales: number;
  };
  curatorMetrics: {
    playlistFollowers: number;
    averageListenTime: number;
    retentionRate: number;
    genreAccuracy: number;
  };
  transparencyScore: number;
  ethicalScore: number;
}

interface SupportedArtist {
  id: string;
  name: string;
  supportAmount: number;
  listenerGrowth: number;
  isVerified: boolean;
  platformShare: number;
}

const MonetizationContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  color: white;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #43cea2, #185a9d);
  }
`;

const EthicsPanel = styled(motion.div)`
  background: rgba(67, 206, 162, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const ArtistList = styled.div`
  margin-top: 20px;
`;

const ArtistCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoTooltip = styled(motion.div)`
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  padding: 10px;
  border-radius: 8px;
  max-width: 250px;
  z-index: 10;
`;

const CuratorMonetization: React.FC<{ curatorId: string }> = ({ curatorId }) => {
  const [metrics, setMetrics] = useState<EarningMetrics | null>(null);
  const [supportedArtists, setSupportedArtists] = useState<SupportedArtist[]>([]);
  const [showEthicsInfo, setShowEthicsInfo] = useState(false);

  useEffect(() => {
    fetchMetrics();
    fetchSupportedArtists();
  }, [curatorId]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/curators/${curatorId}/monetization/metrics`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch monetization metrics:', error);
      toast.error('Could not load monetization data');
    }
  };

  const fetchSupportedArtists = async () => {
    try {
      const response = await fetch(`/api/curators/${curatorId}/supported-artists`);
      const data = await response.json();
      setSupportedArtists(data);
    } catch (error) {
      console.error('Failed to fetch supported artists:', error);
    }
  };

  const handleDirectSupport = async (artistId: string) => {
    try {
      await fetch(`/api/artists/${artistId}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curatorId, supportType: 'direct' })
      });
      toast.success('Thank you for supporting the artist!');
      fetchMetrics();
    } catch (error) {
      toast.error('Failed to process support');
    }
  };

  return (
    <MonetizationContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaCoins /> Curator Earnings & Impact
        </h2>
        {metrics && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">${metrics.totalEarned.toFixed(2)}</div>
              <div className="text-sm opacity-70">Total Earned</div>
            </div>
            <motion.div
              className="flex items-center gap-2 bg-green-500 bg-opacity-20 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <FaUserShield />
              <span>Ethics Score: {metrics.ethicalScore}%</span>
            </motion.div>
          </div>
        )}
      </div>

      {metrics && (
        <MetricsGrid>
          <MetricCard whileHover={{ scale: 1.02 }}>
            <div className="flex justify-between items-start">
              <div>
                <FaMusic className="text-2xl mb-2" />
                <h3 className="font-semibold">Artist Support</h3>
                <div className="text-2xl font-bold mt-2">
                  ${metrics.artistSupport.directSupport}
                </div>
                <p className="text-sm opacity-70">Direct Artist Support</p>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-70">Platform Share</div>
                <div className="text-lg font-semibold text-green-400">
                  Only 5%
                </div>
              </div>
            </div>
          </MetricCard>

          <MetricCard whileHover={{ scale: 1.02 }}>
            <FaChartLine className="text-2xl mb-2" />
            <h3 className="font-semibold">Listener Impact</h3>
            <div className="text-2xl font-bold mt-2">
              {metrics.listenerMinutes.toLocaleString()}
            </div>
            <p className="text-sm opacity-70">Total Listening Minutes</p>
          </MetricCard>

          <MetricCard whileHover={{ scale: 1.02 }}>
            <FaHandshake className="text-2xl mb-2" />
            <h3 className="font-semibold">Curator Score</h3>
            <div className="text-2xl font-bold mt-2">
              {metrics.curatorMetrics.genreAccuracy}%
            </div>
            <p className="text-sm opacity-70">Recommendation Accuracy</p>
          </MetricCard>
        </MetricsGrid>
      )}

      <EthicsPanel>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FaHeart /> Ethical Earnings
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer"
              onClick={() => setShowEthicsInfo(!showEthicsInfo)}
            >
              <FaInfoCircle />
            </motion.div>
          </h3>
          <div className="flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            <span>Transparency Score: {metrics?.transparencyScore}%</span>
          </div>
        </div>

        <AnimatePresence>
          {showEthicsInfo && (
            <InfoTooltip
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p>Our ethical earnings system ensures:</p>
              <ul className="list-disc ml-4 mt-2">
                <li>95% of direct support goes to artists</li>
                <li>Transparent recommendation algorithms</li>
                <li>No pay-to-play schemes</li>
                <li>Fair compensation for curators based on quality</li>
              </ul>
            </InfoTooltip>
          )}
        </AnimatePresence>

        <ArtistList>
          <h4 className="font-semibold mb-4">Supported Artists</h4>
          <AnimatePresence>
            {supportedArtists.map(artist => (
              <ArtistCard
                key={artist.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{artist.name}</span>
                    {artist.isVerified && (
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="bg-blue-500 bg-opacity-20 px-2 py-1 rounded-full text-xs"
                      >
                        Verified Artist
                      </motion.span>
                    )}
                  </div>
                  <div className="text-sm opacity-70">
                    Listener Growth: +{artist.listenerGrowth}%
                  </div>
                </div>

                <button
                  onClick={() => handleDirectSupport(artist.id)}
                  className="bg-gradient-to-r from-green-500 to-blue-500 px-4 py-2 rounded-full text-sm"
                >
                  Support Artist
                </button>
              </ArtistCard>
            ))}
          </AnimatePresence>
        </ArtistList>
      </EthicsPanel>
    </MonetizationContainer>
  );
};

export default CuratorMonetization;

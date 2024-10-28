import { useState, useEffect } from 'react';
import { PlaylistStats } from '../types/playlist';
import { toast } from 'react-toastify';

interface AnalyticsTimeframe {
  start: Date;
  end: Date;
}

interface UsePlaylistAnalyticsOptions {
  playlistId: string;
  timeframe?: AnalyticsTimeframe;
  realtime?: boolean;
}

export const usePlaylistAnalytics = ({ playlistId, timeframe, realtime = false }: UsePlaylistAnalyticsOptions) => {
  const [stats, setStats] = useState<PlaylistStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
    
    if (realtime) {
      const interval = setInterval(fetchAnalytics, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [playlistId, timeframe]);

  const fetchAnalytics = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (timeframe) {
        queryParams.set('start', timeframe.start.toISOString());
        queryParams.set('end', timeframe.end.toISOString());
      }

      const response = await fetch(
        `/api/playlists/${playlistId}/analytics?${queryParams.toString()}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
      toast.error('Could not load analytics');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (format: 'pdf' | 'csv' = 'pdf') => {
    try {
      const response = await fetch(
        `/api/playlists/${playlistId}/analytics/report?format=${format}`,
        { method: 'POST' }
      );
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playlist-analytics-${playlistId}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} report generated successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  const getGrowthRate = () => {
    if (!stats) return null;
    
    const previousPeriodListeners = stats.uniqueListeners - stats.peakListeners;
    const growthRate = ((stats.uniqueListeners - previousPeriodListeners) / previousPeriodListeners) * 100;
    
    return {
      rate: growthRate,
      trend: growthRate > 0 ? 'up' : growthRate < 0 ? 'down' : 'stable'
    };
  };

  const getEngagementScore = () => {
    if (!stats) return null;
    
    const totalPossibleEngagement = stats.uniqueListeners * 3; // likes, comments, shares
    const actualEngagement = stats.likes + stats.comments + stats.shares;
    
    return (actualEngagement / totalPossibleEngagement) * 100;
  };

  return {
    stats,
    loading,
    error,
    generateReport,
    getGrowthRate,
    getEngagementScore,
    refresh: fetchAnalytics
  };
};

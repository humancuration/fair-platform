import { motion } from "framer-motion";
import { FaRobot, FaUser, FaBrain, FaStar, FaGem } from "react-icons/fa";
import { Card, CardContent, Typography, Button, Avatar, Chip } from "@mui/material";
import type { Curator } from "~/types/curator";

interface CuratorCardProps {
  curator: Curator;
  onFollow: () => void;
}

export function CuratorCard({ curator, onFollow }: CuratorCardProps) {
  const TypeIcon = {
    ai: FaRobot,
    human: FaUser,
    hybrid: FaBrain
  }[curator.type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03 }}
    >
      <Card 
        className={`
          bg-gradient-to-br rounded-xl overflow-hidden
          ${curator.type === 'ai' ? 'from-purple-900/30 to-blue-900/30' : 
            curator.type === 'hybrid' ? 'from-green-900/30 to-blue-900/30' :
            'from-orange-900/30 to-red-900/30'}
        `}
      >
        <CardContent className="space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar
                src={curator.avatar}
                alt={curator.name}
                className="w-16 h-16"
              />
              <div>
                <Typography variant="h5" className="font-bold">
                  {curator.name}
                </Typography>
                <div className="flex items-center gap-2 text-sm opacity-80">
                  <TypeIcon />
                  <span>{curator.type.toUpperCase()}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" />
                <span>{curator.curatorScore.toFixed(1)}</span>
              </div>
              <Typography variant="caption" className="opacity-80">
                Curator Score
              </Typography>
            </div>
          </div>

          <Typography variant="body2" className="opacity-90">
            {curator.bio}
          </Typography>

          <div className="flex flex-wrap gap-2">
            {curator.badges.map(badge => (
              <Chip
                key={badge.type}
                icon={<FaGem />}
                label={badge.label}
                size="small"
                className="bg-white/10 hover:bg-white/20 transition-colors"
                title={badge.description}
              />
            ))}
          </div>

          <Button
            onClick={onFollow}
            variant="contained"
            fullWidth
            className="bg-purple-500/20 hover:bg-purple-500/30 normal-case"
          >
            Follow Curator
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

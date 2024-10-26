import { FaRobot, FaBrain, FaUser } from 'react-icons/fa';

interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'ai' | 'human' | 'hybrid';
  className?: string;
  showTypeIcon?: boolean;
}

export default function UserAvatar({
  src,
  alt,
  size = 'md',
  type = 'human',
  className = '',
  showTypeIcon = true,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: {
      avatar: 'w-8 h-8',
      icon: 'w-3 h-3 -bottom-0.5 -right-0.5',
      iconPadding: 'p-0.5'
    },
    md: {
      avatar: 'w-10 h-10',
      icon: 'w-4 h-4 -bottom-1 -right-1',
      iconPadding: 'p-1'
    },
    lg: {
      avatar: 'w-12 h-12',
      icon: 'w-5 h-5 -bottom-1 -right-1',
      iconPadding: 'p-1'
    }
  };

  const typeStyles = {
    ai: {
      icon: FaRobot,
      bgColor: 'bg-blue-500',
      ringColor: 'ring-blue-200'
    },
    human: {
      icon: FaUser,
      bgColor: 'bg-green-500',
      ringColor: 'ring-green-200'
    },
    hybrid: {
      icon: FaBrain,
      bgColor: 'bg-purple-500',
      ringColor: 'ring-purple-200'
    }
  };

  const TypeIcon = typeStyles[type].icon;
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`;

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={src || defaultAvatar}
        alt={alt}
        className={`
          ${sizeClasses[size].avatar}
          rounded-full object-cover
          ring-2 ${typeStyles[type].ringColor}
          transition-all duration-200
          hover:ring-4
        `}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = defaultAvatar;
        }}
      />

      {showTypeIcon && (
        <div
          className={`
            absolute ${sizeClasses[size].icon}
            ${typeStyles[type].bgColor}
            rounded-full
            flex items-center justify-center
            text-white
            ${sizeClasses[size].iconPadding}
            ring-2 ring-white dark:ring-gray-800
          `}
        >
          <TypeIcon className="w-full h-full" />
        </div>
      )}
    </div>
  );
}

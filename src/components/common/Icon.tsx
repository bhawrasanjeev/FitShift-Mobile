import React from 'react';
import Svg, {
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
} from 'react-native-svg';
import { colors } from '../../theme/colors';

export type IconName =
  | 'home'
  | 'dumbbell'
  | 'utensils'
  | 'clock'
  | 'calendar'
  | 'bot'
  | 'sparkles'
  | 'fire'
  | 'activity'
  | 'moon'
  | 'droplet'
  | 'briefcase'
  | 'check'
  | 'check-circle'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-right'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-up'
  | 'refresh'
  | 'edit'
  | 'copy'
  | 'share'
  | 'send'
  | 'info'
  | 'shield'
  | 'alert'
  | 'x'
  | 'shopping-bag'
  | 'pill'
  | 'leaf'
  | 'sun'
  | 'timer'
  | 'user'
  | 'target'
  | 'wallet'
  | 'building'
  | 'filter'
  | 'egg'
  | 'indian-rupee'
  | 'graduation-cap'
  | 'laptop'
  | 'compass'
  | 'search'
  | 'settings'
  | 'trash';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = colors.textPrimary,
  strokeWidth = 2,
}) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'home':
      return (
        <Svg {...commonProps}>
          <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <Polyline points="9 22 9 12 15 12 15 22" />
        </Svg>
      );

    case 'dumbbell':
      return (
        <Svg {...commonProps}>
          <Path d="M6.5 6.5l11 11" />
          <Path d="M21 21l-1-1" />
          <Path d="M3 3l1 1" />
          <Path d="M18 22l4-4-3-3-4 4 3 3z" />
          <Path d="M2 6l4-4 3 3-4 4-3-3z" />
          <Path d="M14.5 9.5l-5 5" />
        </Svg>
      );

    case 'utensils':
      return (
        <Svg {...commonProps}>
          <Path d="M18 2v20" />
          <Path d="M21 15a3 3 0 01-3 3 3 3 0 01-3-3V2h6v13z" />
          <Path d="M6 2v20" />
          <Path d="M4 2v6a2 2 0 004 0V2" />
        </Svg>
      );

    case 'clock':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="12 6 12 12 16 14" />
        </Svg>
      );

    case 'calendar':
      return (
        <Svg {...commonProps}>
          <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <Line x1="16" y1="2" x2="16" y2="6" />
          <Line x1="8" y1="2" x2="8" y2="6" />
          <Line x1="3" y1="10" x2="21" y2="10" />
        </Svg>
      );

    case 'bot':
      return (
        <Svg {...commonProps}>
          <Rect x="3" y="11" width="18" height="10" rx="2" />
          <Circle cx="12" cy="5" r="2" />
          <Path d="M12 7v4" />
          <Line x1="8" y1="16" x2="8" y2="16" />
          <Line x1="16" y1="16" x2="16" y2="16" />
        </Svg>
      );

    case 'sparkles':
      return (
        <Svg {...commonProps}>
          <Path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z" />
          <Path d="M19 17l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
        </Svg>
      );

    case 'fire':
      return (
        <Svg {...commonProps}>
          <Path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 3.5z" />
        </Svg>
      );

    case 'activity':
      return (
        <Svg {...commonProps}>
          <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </Svg>
      );

    case 'moon':
      return (
        <Svg {...commonProps}>
          <Path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </Svg>
      );

    case 'droplet':
      return (
        <Svg {...commonProps}>
          <Path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </Svg>
      );

    case 'briefcase':
      return (
        <Svg {...commonProps}>
          <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <Path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
        </Svg>
      );

    case 'check':
      return (
        <Svg {...commonProps}>
          <Polyline points="20 6 9 17 4 12" />
        </Svg>
      );

    case 'check-circle':
      return (
        <Svg {...commonProps}>
          <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <Polyline points="22 4 12 14.01 9 11.01" />
        </Svg>
      );

    case 'chevron-down':
      return (
        <Svg {...commonProps}>
          <Polyline points="6 9 12 15 18 9" />
        </Svg>
      );

    case 'chevron-up':
      return (
        <Svg {...commonProps}>
          <Polyline points="18 15 12 9 6 15" />
        </Svg>
      );

    case 'chevron-right':
      return (
        <Svg {...commonProps}>
          <Polyline points="9 18 15 12 9 6" />
        </Svg>
      );

    case 'arrow-left':
      return (
        <Svg {...commonProps}>
          <Line x1="19" y1="12" x2="5" y2="12" />
          <Polyline points="12 19 5 12 12 5" />
        </Svg>
      );

    case 'arrow-right':
      return (
        <Svg {...commonProps}>
          <Line x1="5" y1="12" x2="19" y2="12" />
          <Polyline points="12 5 19 12 12 19" />
        </Svg>
      );

    case 'arrow-up':
      return (
        <Svg {...commonProps}>
          <Line x1="12" y1="19" x2="12" y2="5" />
          <Polyline points="5 12 12 5 19 12" />
        </Svg>
      );

    case 'refresh':
      return (
        <Svg {...commonProps}>
          <Polyline points="23 4 23 10 17 10" />
          <Polyline points="1 20 1 14 7 14" />
          <Path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </Svg>
      );

    case 'edit':
      return (
        <Svg {...commonProps}>
          <Path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <Path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </Svg>
      );

    case 'copy':
      return (
        <Svg {...commonProps}>
          <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </Svg>
      );

    case 'share':
      return (
        <Svg {...commonProps}>
          <Circle cx="18" cy="5" r="3" />
          <Circle cx="6" cy="12" r="3" />
          <Circle cx="18" cy="19" r="3" />
          <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </Svg>
      );

    case 'send':
      return (
        <Svg {...commonProps}>
          <Line x1="22" y1="2" x2="11" y2="13" />
          <Path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </Svg>
      );

    case 'info':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
          <Line x1="12" y1="16" x2="12" y2="12" />
          <Line x1="12" y1="8" x2="12.01" y2="8" />
        </Svg>
      );

    case 'shield':
      return (
        <Svg {...commonProps}>
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </Svg>
      );

    case 'alert':
      return (
        <Svg {...commonProps}>
          <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <Line x1="12" y1="9" x2="12" y2="13" />
          <Line x1="12" y1="17" x2="12.01" y2="17" />
        </Svg>
      );

    case 'x':
      return (
        <Svg {...commonProps}>
          <Line x1="18" y1="6" x2="6" y2="18" />
          <Line x1="6" y1="6" x2="18" y2="18" />
        </Svg>
      );

    case 'shopping-bag':
      return (
        <Svg {...commonProps}>
          <Path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <Line x1="3" y1="6" x2="21" y2="6" />
          <Path d="M16 10a4 4 0 01-8 0" />
        </Svg>
      );

    case 'pill':
      return (
        <Svg {...commonProps}>
          <Path d="M10.5 20.5l10-10a4.95 4.95 0 10-7-7l-10 10a4.95 4.95 0 107 7z" />
          <Line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
        </Svg>
      );

    case 'leaf':
      return (
        <Svg {...commonProps}>
          <Path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
          <Path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </Svg>
      );

    case 'sun':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="5" />
          <Line x1="12" y1="1" x2="12" y2="3" />
          <Line x1="12" y1="21" x2="12" y2="23" />
          <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <Line x1="1" y1="12" x2="3" y2="12" />
          <Line x1="21" y1="12" x2="23" y2="12" />
          <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </Svg>
      );

    case 'timer':
      return (
        <Svg {...commonProps}>
          <Line x1="10" y1="2" x2="14" y2="2" />
          <Line x1="12" y1="14" x2="15" y2="11" />
          <Circle cx="12" cy="14" r="8" />
        </Svg>
      );

    case 'user':
      return (
        <Svg {...commonProps}>
          <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <Circle cx="12" cy="7" r="4" />
        </Svg>
      );

    case 'target':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
          <Circle cx="12" cy="12" r="6" />
          <Circle cx="12" cy="12" r="2" />
        </Svg>
      );

    case 'wallet':
      return (
        <Svg {...commonProps}>
          <Rect x="2" y="5" width="20" height="14" rx="2" />
          <Path d="M16 12h2" />
        </Svg>
      );

    case 'building':
      return (
        <Svg {...commonProps}>
          <Rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <Line x1="9" y1="22" x2="9" y2="18" />
          <Line x1="15" y1="22" x2="15" y2="18" />
          <Line x1="8" y1="6" x2="8.01" y2="6" />
          <Line x1="16" y1="6" x2="16.01" y2="6" />
          <Line x1="8" y1="10" x2="8.01" y2="10" />
          <Line x1="16" y1="10" x2="16.01" y2="10" />
          <Line x1="8" y1="14" x2="8.01" y2="14" />
          <Line x1="16" y1="14" x2="16.01" y2="14" />
        </Svg>
      );

    case 'filter':
      return (
        <Svg {...commonProps}>
          <Path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </Svg>
      );

    case 'egg':
      return (
        <Svg {...commonProps}>
          <Path d="M12 2C8.5 2 5 7.5 5 14a7 7 0 0014 0c0-6.5-3.5-12-7-12z" />
        </Svg>
      );

    case 'indian-rupee':
      return (
        <Svg {...commonProps}>
          <Path d="M6 3h12" />
          <Path d="M6 8h12" />
          <Path d="M6 13l8.5 8" />
          <Path d="M6 13h3a4 4 0 000-8" />
        </Svg>
      );

    case 'graduation-cap':
      return (
        <Svg {...commonProps}>
          <Path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <Path d="M6 12v5c3 3 9 3 12 0v-5" />
        </Svg>
      );

    case 'laptop':
      return (
        <Svg {...commonProps}>
          <Rect x="3" y="4" width="18" height="12" rx="2" />
          <Line x1="2" y1="20" x2="22" y2="20" />
        </Svg>
      );

    case 'compass':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
          <Path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88Z" />
        </Svg>
      );

    case 'search':
      return (
        <Svg {...commonProps}>
          <Circle cx="11" cy="11" r="8" />
          <Line x1="21" y1="21" x2="16.65" y2="16.65" />
        </Svg>
      );

    case 'settings':
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="3" />
          <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </Svg>
      );

    case 'trash':
      return (
        <Svg {...commonProps}>
          <Polyline points="3 6 5 6 21 6" />
          <Path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </Svg>
      );

    default:
      return (
        <Svg {...commonProps}>
          <Circle cx="12" cy="12" r="10" />
        </Svg>
      );
  }
};

export default Icon;

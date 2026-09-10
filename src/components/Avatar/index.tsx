import {
  AvatarProps,
  BigHead,
  mouthsMap,
  theme,
  ThemeContext,
} from '@bigheads/core';
import React, { useEffect, useRef, useState } from 'react';

interface CustomAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  avatarProps?: AvatarProps;
  animate?: boolean;
  glanceAtCursor?: boolean;
}

// Same viewBox @bigheads/core renders the full avatar with - keeping these
// overlays aligned to the real mouth/eyes underneath.
const AVATAR_VIEW_BOX = '0 0 1000 990';
const MAX_PUPIL_OFFSET = 14;

interface Pupil {
  cx: number;
  cy: number;
  r: number;
}

// Pupil coordinates copied from @bigheads/core's own eye components - only
// eye styles with a plain circular pupil support glancing; the rest (happy,
// content, dizzy, heart, simple) have no separate pupil to move and are
// left alone.
const EYE_PUPILS: Partial<
  Record<string, { left: Pupil; right: Pupil | null }>
> = {
  normal: {
    left: { cx: 338.51, cy: 550.79, r: 12.24 },
    right: { cx: 659.21, cy: 550.79, r: 12.24 },
  },
  leftTwitch: {
    left: { cx: 338.51, cy: 541.79, r: 12.24 },
    right: { cx: 659.21, cy: 550.79, r: 12.24 },
  },
  squint: {
    left: { cx: 338.51, cy: 559.08, r: 12.24 },
    right: { cx: 659.21, cy: 559.08, r: 12.24 },
  },
  wink: {
    left: { cx: 338.51, cy: 559.08, r: 12.24 },
    right: null,
  },
};

const Avatar = ({
  avatarProps,
  animate = false,
  glanceAtCursor = false,
  className,
  style,
  ...props
}: CustomAvatarProps) => {
  // Randomized once per mount so multiple avatars don't move in sync.
  const delay = useRef(-(Math.random() * 2)).current;
  const [look, setLook] = useState({ x: 0, y: 0 });
  const Mouth = mouthsMap[avatarProps?.mouth ?? 'grin'];
  const skinTone = avatarProps?.skinTone ?? 'light';
  const pupils = EYE_PUPILS[avatarProps?.eyes ?? 'normal'];

  useEffect(() => {
    if (!glanceAtCursor) return;

    const applyLook = (dx: number, dy: number) => {
      setLook({
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      });
    };

    // Desktop: glance toward the mouse.
    const handleMouseMove = (e: MouseEvent) => {
      applyLook(
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      );
    };

    // Mobile with orientation sensors: glance with the tilt of the phone.
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      applyLook(e.gamma / 30, (e.beta - 45) / 30);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleOrientation);

    // iOS only fires deviceorientation after an explicit, gesture-triggered
    // permission grant - request it on the first tap, best-effort. Guarded
    // since DeviceOrientationEvent isn't defined on every browser/webview.
    const requestPermission =
      typeof DeviceOrientationEvent !== 'undefined'
        ? (
            DeviceOrientationEvent as unknown as {
              requestPermission?: () => Promise<'granted' | 'denied'>;
            }
          ).requestPermission
        : undefined;
    const grantOnFirstTouch = () => {
      requestPermission?.().catch(() => {});
    };
    if (requestPermission) {
      window.addEventListener('pointerdown', grantOnFirstTouch, {
        once: true,
      });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('pointerdown', grantOnFirstTouch);
    };
  }, [glanceAtCursor]);

  return (
    <div className={`relative ${className ?? ''}`} style={style} {...props}>
      <BigHead {...avatarProps} />
      {animate && (
        <svg
          viewBox={AVATAR_VIEW_BOX}
          className="absolute inset-0 w-full h-full animate-mouth-talk pointer-events-none"
          style={{ animationDelay: `${delay}s` }}
        >
          <ThemeContext.Provider
            value={{ colors: theme.colors, skin: theme.colors.skin[skinTone] }}
          >
            <Mouth lipColor={avatarProps?.lipColor} />
          </ThemeContext.Provider>
        </svg>
      )}
      {glanceAtCursor && pupils && (
        <svg
          viewBox={AVATAR_VIEW_BOX}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {[pupils.left, pupils.right].map(
            (pupil, i) =>
              pupil && (
                <g key={i}>
                  <circle
                    cx={pupil.cx}
                    cy={pupil.cy}
                    r={pupil.r + 1.5}
                    fill={theme.colors.white}
                  />
                  <circle
                    cx={pupil.cx + look.x * MAX_PUPIL_OFFSET}
                    cy={pupil.cy + look.y * MAX_PUPIL_OFFSET}
                    r={pupil.r}
                    fill={theme.colors.outline}
                  />
                </g>
              )
          )}
        </svg>
      )}
    </div>
  );
};

export default Avatar;

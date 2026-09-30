import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  AvatarConfig,
  AvatarExpression,
  canBlink,
  getAvatarSvg,
  toAvatarConfig,
} from '@/utils/avatar';

interface CustomAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  avatar?: AvatarConfig;
  // Idle sway.
  animate?: boolean;
  expression?: AvatarExpression;
  // A new value plays a short talking animation.
  talkNonce?: number;
  // Clicking gives a squish and a surprised face.
  pokeable?: boolean;
}

// Matches the last stroke's delay + duration in .avatar-draw-in.
const DRAW_IN_MS = 1400;
const BLINK_MS = 150;
const TALK_MS = 1200;
const POKE_MS = 700;

const Avatar = ({
  avatar,
  animate = false,
  expression,
  talkNonce,
  pokeable = false,
  className,
  style,
  onClick,
  ...props
}: CustomAvatarProps) => {
  // Randomized once per mount so multiple avatars don't move in sync.
  const delay = useRef(-(Math.random() * 2)).current;
  const config = useMemo(() => toAvatarConfig(avatar), [avatar]);
  const [isDrawingIn, setIsDrawingIn] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isPoked, setIsPoked] = useState(false);
  const [popCount, setPopCount] = useState(0);
  const pokeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const shownExpression = isPoked ? 'surprised' : expression;
  const svg = useMemo(
    () => getAvatarSvg(config, shownExpression),
    [config, shownExpression]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsDrawingIn(false), DRAW_IN_MS);
    return () => clearTimeout(timer);
  }, []);

  // Random gaps so a room of avatars doesn't blink in unison.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      timer = setTimeout(() => {
        setIsBlinking(true);
        timer = setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, BLINK_MS);
      }, 2500 + Math.random() * 3500);
    };
    scheduleBlink();
    return () => clearTimeout(timer);
  }, []);

  // Pop when the face changes (typing a name, a game expression) - compared by value so StrictMode's double effects don't pop on mount. Pokes pop on their own.
  const faceKey = `${JSON.stringify(config)}|${expression}`;
  const shownFaceRef = useRef(faceKey);
  useEffect(() => {
    if (shownFaceRef.current === faceKey) return;
    shownFaceRef.current = faceKey;
    setPopCount((count) => count + 1);
  }, [faceKey]);

  useEffect(() => {
    if (talkNonce === undefined) return;
    setIsTalking(true);
    const timer = setTimeout(() => setIsTalking(false), TALK_MS);
    return () => clearTimeout(timer);
  }, [talkNonce]);

  useEffect(() => () => clearTimeout(pokeTimerRef.current), []);

  const poke = () => {
    clearTimeout(pokeTimerRef.current);
    setPopCount((count) => count + 1);
    setIsPoked(true);
    pokeTimerRef.current = setTimeout(() => setIsPoked(false), POKE_MS);
  };

  const pokeProps = pokeable
    ? {
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Poke your doodler',
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          poke();
        },
      }
    : {};

  const svgClassName = [
    isDrawingIn && 'avatar-draw-in',
    isBlinking && canBlink(config, shownExpression) && 'avatar-blinking',
    isTalking && 'avatar-talking',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...props}
      {...pokeProps}
      className={`relative ${pokeable ? 'cursor-pointer select-none' : ''} ${
        className ?? ''
      }`}
      style={style}
      onClick={(e) => {
        onClick?.(e);
        if (pokeable) poke();
      }}
    >
      <div
        className={animate ? 'animate-doodle-wobble' : undefined}
        style={animate ? { animationDelay: `${delay}s` } : undefined}
      >
        <div
          key={popCount}
          className={popCount ? 'animate-avatar-pop' : undefined}
        >
          <div
            className={svgClassName}
            // Generated locally by DiceBear from a validated config - no user markup.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
    </div>
  );
};

export default Avatar;

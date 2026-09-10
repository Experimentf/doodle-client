import {
  FaAnchor,
  FaCarrot,
  FaCat,
  FaCloud,
  FaFish,
  FaGhost,
  FaHeart,
  FaLightbulb,
  FaMoon,
  FaMusic,
  FaRainbow,
  FaRocket,
  FaStar,
  FaSun,
  FaTree,
  FaUmbrella,
} from 'react-icons/fa6';

const ICONS = [
  FaStar,
  FaCloud,
  FaLightbulb,
  FaHeart,
  FaMusic,
  FaUmbrella,
  FaSun,
  FaMoon,
  FaGhost,
  FaCat,
  FaFish,
  FaRocket,
  FaAnchor,
  FaCarrot,
  FaRainbow,
  FaTree,
];

const COLORS = [
  'text-chalk-white',
  'text-chalk-blue',
  'text-chalk-green',
  'text-chalk-pink',
  'text-chalk-yellow',
];

// Scattered like doodles on a chalkboard - deterministic, computed once.
const doodles = ICONS.map((Icon, i) => ({
  Icon,
  left: `${((i * 137) % 88) + 4}%`,
  top: `${((i * 71) % 88) + 4}%`,
  rotate: ((i * 47) % 60) - 30,
  size: 22 + ((i * 13) % 18),
  color: COLORS[i % COLORS.length],
  duration: 16 + ((i * 5) % 14),
  delay: -((i * 3) % 20),
  opacity: 0.08 + (i % 3) * 0.03,
}));

const AmbientBackground = () => (
  <div
    className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    aria-hidden
  >
    {doodles.map(
      (
        { Icon, left, top, rotate, size, color, duration, delay, opacity },
        index
      ) => (
        <div
          key={index}
          className="absolute"
          style={{ left, top, transform: `rotate(${rotate}deg)` }}
        >
          <Icon
            className={`${color} animate-chalk-breathe`}
            style={
              {
                fontSize: size,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                '--chalk-opacity': opacity,
              } as React.CSSProperties
            }
          />
        </div>
      )
    )}
  </div>
);

export default AmbientBackground;

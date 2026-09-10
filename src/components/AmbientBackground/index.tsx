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

const BASE_COUNT = ICONS.length;

// Scattered like doodles on a chalkboard - deterministic, computed once.
// This is what mobile sees, unchanged.
const makeBaseDoodle = (i: number) => ({
  Icon: ICONS[i % ICONS.length],
  left: `${((i * 137) % 88) + 4}%`,
  top: `${((i * 71) % 88) + 4}%`,
  rotate: ((i * 47) % 60) - 30,
  size: 22 + ((i * 13) % 18),
  color: COLORS[i % COLORS.length],
  duration: 16 + ((i * 5) % 14),
  delay: -((i * 3) % 20),
  opacity: 0.08 + (i % 3) * 0.03,
  wide: false,
});

// R2 low-discrepancy sequence - even 2D coverage with no clustering, unlike the base layer's naive modulo scatter.
const G1 = 0.7548776662466927;
const G2 = 0.5698402909980532;
const fract = (n: number) => n - Math.floor(n);

// A second, denser layer that only shows from lg: up, since the base
// layer's count alone reads as sparse on a much wider viewport.
const makeWideDoodle = (i: number) => ({
  Icon: ICONS[i % ICONS.length],
  left: `${fract((i + 0.5) * G1) * 88 + 4}%`,
  top: `${fract((i + 0.5) * G2) * 88 + 4}%`,
  rotate: ((i * 47) % 60) - 30,
  size: 22 + ((i * 13) % 18),
  color: COLORS[i % COLORS.length],
  duration: 16 + ((i * 5) % 14),
  delay: -((i * 3) % 20),
  opacity: 0.08 + (i % 3) * 0.03,
  wide: true,
});

const doodles = [
  ...Array.from({ length: BASE_COUNT }, (_, i) => makeBaseDoodle(i)),
  ...Array.from({ length: BASE_COUNT }, (_, i) => makeWideDoodle(i)),
];

const AmbientBackground = () => (
  <div
    className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
    aria-hidden
  >
    {doodles.map(
      (
        {
          Icon,
          left,
          top,
          rotate,
          size,
          color,
          duration,
          delay,
          opacity,
          wide,
        },
        index
      ) => (
        <div
          key={index}
          className={`absolute ${wide ? 'hidden lg:block' : ''}`}
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

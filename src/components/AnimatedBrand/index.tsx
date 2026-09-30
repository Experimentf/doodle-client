// Two same-size transparent layers of one artwork, stacked: the chalkboard
// ("pad") behind, "hunch" with its crown in front - split so they can drop in
// separately. The board's hidden part behind the "h" is filled in its layer.
const BRAND_ASPECT_RATIO = '1100 / 414';
const HUNCH_SRC = `${process.env.PUBLIC_URL}/assets/brand-hunch.webp`;
const PAD_SRC = `${process.env.PUBLIC_URL}/assets/brand-pad.webp`;

interface AnimatedBrandProps {
  className?: string;
  // Soft pulse while connecting.
  loading?: boolean;
  // Home page entrance: "hunch" then the "pad" chalkboard drop in from above the screen.
  dropIn?: boolean;
}

const AnimatedBrand = ({
  className,
  loading = false,
  dropIn = false,
}: AnimatedBrandProps) => (
  <div
    role="img"
    aria-label="hunchpad"
    className={`relative ${loading ? 'animate-pulse' : ''} ${className ?? ''}`}
    style={{ aspectRatio: BRAND_ASPECT_RATIO }}
  >
    <img
      src={PAD_SRC}
      alt=""
      draggable={false}
      className={`absolute inset-0 w-full h-full ${
        dropIn ? 'animate-brand-drop-late' : ''
      }`}
    />
    <img
      src={HUNCH_SRC}
      alt=""
      draggable={false}
      className={`absolute inset-0 w-full h-full ${
        dropIn ? 'animate-brand-drop' : ''
      }`}
    />
  </div>
);

export default AnimatedBrand;

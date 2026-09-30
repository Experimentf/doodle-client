import { createAvatar } from '@dicebear/core';
import * as croodles from '@dicebear/croodles';

type SchemaProperty = { items?: { enum?: string[] } };
const variantsOf = (part: string) =>
  [
    ...(((croodles.schema.properties?.[part] ?? {}) as SchemaProperty).items
      ?.enum ?? []),
  ].sort();

export const AVATAR_OPTIONS = {
  face: variantsOf('face'),
  eyes: variantsOf('eyes'),
  nose: variantsOf('nose'),
  mouth: variantsOf('mouth'),
  top: variantsOf('top'),
  beard: ['none', ...variantsOf('beard')],
  mustache: ['none', ...variantsOf('mustache')],
};

// Pastel faces so avatars aren't all paper-white on the board.
export const FACE_COLORS = [
  'fff1b8',
  'ffd9c2',
  'c8f0d4',
  'cde8ff',
  'e6d8ff',
  'ffd1dc',
];

// Croodles' hair palette minus black, which vanishes against the board.
export const HAIR_COLORS = ['ffc700', '9747ff', 'f24e1e', '699bf7', '0fa958'];

export type AvatarPart = keyof typeof AVATAR_OPTIONS;

export type AvatarConfig = Record<AvatarPart, string> & {
  topColor: string;
  baseColor: string;
};

export type AvatarExpression = 'happy' | 'focused' | 'surprised';

// Picked by eye from the Croodles variants. The second pick is for faces whose own part is already the first, so the expression still visibly changes.
const EXPRESSIONS: Record<
  AvatarExpression,
  Partial<Record<AvatarPart, [string, string]>>
> = {
  happy: {
    eyes: ['variant03', 'variant07'],
    mouth: ['variant10', 'variant11'],
  },
  focused: { mouth: ['variant18', 'variant06'] },
  surprised: {
    eyes: ['variant05', 'variant02'],
    mouth: ['variant14', 'variant15'],
  },
};

const resolveExpression = (
  config: AvatarConfig,
  expression?: AvatarExpression
): AvatarConfig => {
  if (!expression) return config;
  const resolved = { ...config };
  Object.entries(EXPRESSIONS[expression]).forEach(([part, picks]) => {
    const key = part as AvatarPart;
    resolved[key] = picks[0] === config[key] ? picks[1] : picks[0];
  });
  return resolved;
};

// Already closed (happy arcs, > <, lines) or behind glasses, where squashing would flatten the frames.
const NON_BLINKING_EYES = new Set([
  'variant03',
  'variant05',
  'variant08',
  'variant09',
  'variant13',
  'variant14',
  'variant15',
]);

export const canBlink = (config: AvatarConfig, expression?: AvatarExpression) =>
  !NON_BLINKING_EYES.has(resolveExpression(config, expression).eyes);

const DEFAULT_AVATAR: AvatarConfig = {
  face: AVATAR_OPTIONS.face[0],
  eyes: AVATAR_OPTIONS.eyes[0],
  nose: AVATAR_OPTIONS.nose[0],
  mouth: AVATAR_OPTIONS.mouth[0],
  top: AVATAR_OPTIONS.top[0],
  beard: 'none',
  mustache: 'none',
  topColor: HAIR_COLORS[0],
  baseColor: FACE_COLORS[0],
};

// DiceBear reports picked colors with a leading '#', its options take them without.
const pickColor = (value: unknown, palette: string[]) => {
  const color = typeof value === 'string' ? value.replace(/^#/, '') : '';
  return palette.includes(color) ? color : undefined;
};

// Avatars arrive from other clients as untrusted objects - possibly an older avatar format.
export const toAvatarConfig = (value: unknown): AvatarConfig => {
  const input = (value && typeof value === 'object' ? value : {}) as Record<
    string,
    unknown
  >;
  const config = { ...DEFAULT_AVATAR };
  (Object.keys(AVATAR_OPTIONS) as AvatarPart[]).forEach((part) => {
    const candidate = input[part];
    if (
      typeof candidate === 'string' &&
      AVATAR_OPTIONS[part].includes(candidate)
    ) {
      config[part] = candidate;
    }
  });
  config.topColor = pickColor(input.topColor, HAIR_COLORS) ?? config.topColor;
  config.baseColor =
    pickColor(input.baseColor, FACE_COLORS) ?? config.baseColor;
  return config;
};

// Same picks the DiceBear site shows for this seed; parts it skips (beard, mustache) fall back to 'none'.
export const getSeededAvatar = (seed: string) =>
  toAvatarConfig(
    createAvatar(croodles, {
      seed,
      baseColor: FACE_COLORS,
      topColor: HAIR_COLORS,
    }).toJson().extra
  );

const withPart = (variant: string) =>
  variant === 'none'
    ? { probability: 0, variants: undefined }
    : { probability: 100, variants: [variant] };

// Order Croodles stacks its layers in, after the face fill path.
const PART_LAYERS = [
  'outline',
  'nose',
  'beard',
  'mouth',
  'top',
  'mustache',
  'eyes',
];

// Wraps each layer's content in a classed group (the layer itself carries a
// translate that CSS transforms would override) and preps strokes for draw-in.
const tagParts = (svg: string) => {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const root = doc.documentElement;
  root.querySelector('metadata')?.remove();
  // Its fixed id would collide between inline avatars; it only clips to the viewBox.
  root.querySelector('mask')?.remove();
  const layer = Array.from(root.children).find((el) => el.tagName === 'g');
  if (!layer) return svg;
  layer.removeAttribute('mask');
  const layerChildren = Array.from(layer.children);
  layerChildren
    .find((el) => el.tagName === 'path')
    ?.setAttribute('class', 'avatar-fill');
  layerChildren
    .filter((child) => child.tagName === 'g')
    .forEach((group, index) => {
      const wrapper = doc.createElementNS(root.namespaceURI, 'g');
      wrapper.setAttribute(
        'class',
        `avatar-part avatar-part-${PART_LAYERS[index] ?? 'other'}`
      );
      while (group.firstChild) wrapper.appendChild(group.firstChild);
      group.appendChild(wrapper);
    });
  layer
    .querySelectorAll('.avatar-part path')
    .forEach((path) => path.setAttribute('pathLength', '1'));
  root.setAttribute('class', 'avatar-svg');
  return new XMLSerializer().serializeToString(root);
};

// Every keystroke in the name field produces a new seed, so keep the cache bounded.
const MAX_CACHED_SVGS = 500;
const svgCache = new Map<string, string>();

export const getAvatarSvg = (
  config: AvatarConfig,
  expression?: AvatarExpression
) => {
  const resolved = resolveExpression(config, expression);
  const key = JSON.stringify(resolved);
  const cached = svgCache.get(key);
  if (cached) return cached;
  const beard = withPart(resolved.beard);
  const mustache = withPart(resolved.mustache);
  const svg = tagParts(
    createAvatar(croodles, {
      face: [resolved.face],
      eyes: [resolved.eyes],
      nose: [resolved.nose],
      mouth: [resolved.mouth],
      top: [resolved.top],
      topColor: [resolved.topColor],
      baseColor: [resolved.baseColor],
      beard: beard.variants,
      beardProbability: beard.probability,
      mustache: mustache.variants,
      mustacheProbability: mustache.probability,
    } as croodles.Options).toString()
  );
  if (svgCache.size >= MAX_CACHED_SVGS) svgCache.clear();
  svgCache.set(key, svg);
  return svg;
};

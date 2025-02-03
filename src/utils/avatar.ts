import {
  accessoryMap,
  AvatarProps,
  bodyMap,
  clothingMap,
  eyebrowsMap,
  eyesMap,
  facialHairMap,
  hairMap,
  hatMap,
  mouthsMap,
  theme,
} from '@bigheads/core';

export const avatarPropToOptionsMap = {
  accessory: Object.keys(accessoryMap),
  body: Object.keys(bodyMap),
  clothing: Object.keys(clothingMap),
  eyebrows: Object.keys(eyebrowsMap),
  eyes: Object.keys(eyesMap),
  facialHair: Object.keys(facialHairMap),
  graphic: ['none'],
  hair: Object.keys(hairMap),
  hat: Object.keys(hatMap),
  mouth: Object.keys(mouthsMap),
  skinTone: Object.keys(theme.colors.skin),
  hairColor: Object.keys(theme.colors.hair),
  clothingColor: Object.keys(theme.colors.clothing),
  circleColor: Object.keys(theme.colors.bgColors),
  lipColor: Object.keys(theme.colors.lipColors),
  hatColor: Object.keys(theme.colors.clothing),
  faceMaskColor: Object.keys(theme.colors.clothing),
  faceMask: [true, false],
  mask: [true, false],
  lashes: [true, false],
};

const getRandomProp = <T extends object>(prop: T) => {
  const keys = Object.keys(prop) as Array<keyof T>;
  return keys[Math.round(Math.random() * (keys.length - 1))];
};

const getRandomBoolean = () => {
  return Math.random() <= 0.5;
};

export const getRandomAvatarProps = (): AvatarProps => ({
  accessory: getRandomProp(accessoryMap),
  body: getRandomProp(bodyMap),
  clothing: getRandomProp(clothingMap),
  eyebrows: getRandomProp(eyebrowsMap),
  eyes: getRandomProp(eyesMap),
  facialHair: getRandomProp(facialHairMap),
  graphic: 'none',
  hair: getRandomProp(hairMap),
  hat: getRandomProp(hatMap),
  mouth: getRandomProp(mouthsMap),
  skinTone: getRandomProp(theme.colors.skin),
  hairColor: getRandomProp(theme.colors.hair),
  clothingColor: getRandomProp(theme.colors.clothing),
  circleColor: getRandomProp(theme.colors.bgColors),
  lipColor: getRandomProp(theme.colors.lipColors),
  hatColor: getRandomProp(theme.colors.clothing),
  faceMaskColor: getRandomProp(theme.colors.clothing),
  faceMask: getRandomBoolean(),
  mask: getRandomBoolean(),
  lashes: getRandomBoolean(),
});

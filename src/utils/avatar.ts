import {
  accessoryMap,
  AvatarProps,
  clothingMap,
  eyebrowsMap,
  eyesMap,
  facialHairMap,
  hairMap,
  mouthsMap,
  theme,
} from '@bigheads/core';

const AvatarBaseProps: AvatarProps = {
  graphic: 'none',
  hat: 'none',
  faceMask: false,
  mask: true,
};

const ManAvatarBaseProps: AvatarProps = {
  body: 'chest',
  lashes: false,
  ...AvatarBaseProps,
};

const WomanAvatarBaseProps: AvatarProps = {
  body: 'breasts',
  lashes: true,
  ...AvatarBaseProps,
};

const getRandomProp = <T extends object>(prop: T) => {
  const keys = Object.keys(prop) as Array<keyof T>;
  return keys[Math.round(Math.random() * (keys.length - 1))];
};

export const getRandomAvatarProps = (): AvatarProps => {
  const isMan = Math.random() < 0.5;
  return {
    accessory: getRandomProp(accessoryMap),
    clothing: getRandomProp(clothingMap),
    eyebrows: getRandomProp(eyebrowsMap),
    eyes: getRandomProp(eyesMap),
    facialHair: getRandomProp(facialHairMap),
    hair: getRandomProp(hairMap),
    mouth: getRandomProp(mouthsMap),
    skinTone: getRandomProp(theme.colors.skin),
    hairColor: getRandomProp(theme.colors.hair),
    clothingColor: getRandomProp(theme.colors.clothing),
    lipColor: getRandomProp(theme.colors.lipColors),
    ...(isMan ? ManAvatarBaseProps : WomanAvatarBaseProps),
  };
};

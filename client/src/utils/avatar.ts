import {
    accessoryMap,
    bodyMap,
    clothingMap,
    eyebrowsMap,
    eyesMap,
    facialHairMap,
    graphicsMap,
    hairMap,
    hatMap,
    mouthsMap,
    AvatarProps,
    theme,
} from "@bigheads/core";

export const AvatarAccessories = Object.keys(accessoryMap);
export const AvatarBody = Object.keys(bodyMap);
export const AvatarClothing = Object.keys(clothingMap);
export const AvatarEyebrows = Object.keys(eyebrowsMap);
export const AvatarEyes = Object.keys(eyesMap);
export const AvatarFacialHair = Object.keys(facialHairMap);
export const AvatarGraphics = Object.keys(graphicsMap);
export const AvatarHair = Object.keys(hairMap);
export const AvatarHat = Object.keys(hatMap);
export const AvatarMouth = Object.keys(mouthsMap);
export const AvatarSkinTones = Object.keys(theme.colors.skin);
export const AvatarHairColor = Object.keys(theme.colors.hair);
export const AvatarClothingColor = Object.keys(theme.colors.clothing);
export const AvatarCircleColor = Object.keys(theme.colors.bgColors);
export const AvatarlLipColor = Object.keys(theme.colors.lipColors);
export const AvatarHatColor = Object.keys(theme.colors.clothing);
export const AvatarFaceMaskColor = Object.keys(theme.colors.clothing);
export const AvatarLashes = [true, false];
export const AvatarFaceMask = [true, false];
export const AvatarMask = [true, false];

export const getRandomAvatarProps = (): AvatarProps => {
    const avatarProps: AvatarProps = {
        accessory: AvatarAccessories[
            Math.round(Math.random() * (AvatarAccessories.length - 1))
        ] as keyof typeof accessoryMap,

        body: AvatarBody[
            Math.round(Math.random() * (AvatarBody.length - 1))
        ] as keyof typeof bodyMap,

        clothing: AvatarClothing[
            Math.round(Math.random() * (AvatarClothing.length - 1))
        ] as keyof typeof clothingMap,

        eyebrows: AvatarEyebrows[
            Math.round(Math.random() * (AvatarEyebrows.length - 1))
        ] as keyof typeof eyebrowsMap,

        eyes: AvatarEyes[
            Math.round(Math.random() * (AvatarEyes.length - 1))
        ] as keyof typeof eyesMap,

        facialHair: AvatarFacialHair[
            Math.round(Math.random() * (AvatarFacialHair.length - 1))
        ] as keyof typeof facialHairMap,

        graphic: "none",

        hair: AvatarHair[
            Math.round(Math.random() * (AvatarHair.length - 1))
        ] as keyof typeof hairMap,

        hat: AvatarHat[
            Math.round(Math.random() * (AvatarHat.length - 1))
        ] as keyof typeof hatMap,

        mouth: AvatarMouth[
            Math.round(Math.random() * (AvatarMouth.length - 1))
        ] as keyof typeof mouthsMap,

        skinTone: AvatarSkinTones[
            Math.round(Math.random() * (AvatarSkinTones.length - 1))
        ] as keyof typeof theme.colors.skin,

        hairColor: AvatarHairColor[
            Math.round(Math.random() * (AvatarHairColor.length - 1))
        ] as keyof typeof theme.colors.hair,

        clothingColor: AvatarClothingColor[
            Math.round(Math.random() * (AvatarClothingColor.length - 1))
        ] as keyof typeof theme.colors.clothing,

        circleColor: AvatarCircleColor[
            Math.round(Math.random() * (AvatarCircleColor.length - 1))
        ] as keyof typeof theme.colors.bgColors,

        lipColor: AvatarlLipColor[
            Math.round(Math.random() * (AvatarlLipColor.length - 1))
        ] as keyof typeof theme.colors.lipColors,

        hatColor: AvatarHatColor[
            Math.round(Math.random() * (AvatarHatColor.length - 1))
        ] as keyof typeof theme.colors.clothing,

        faceMaskColor: AvatarFaceMaskColor[
            Math.round(Math.random() * (AvatarFaceMaskColor.length - 1))
        ] as keyof typeof theme.colors.clothing,

        faceMask:
            AvatarFaceMask[
                Math.round(Math.random() * (AvatarFaceMask.length - 1))
            ],

        mask: AvatarMask[Math.round(Math.random() * (AvatarMask.length - 1))],

        lashes: AvatarLashes[
            Math.round(Math.random() * (AvatarLashes.length - 1))
        ],
    };

    return avatarProps;
};

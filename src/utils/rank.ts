import { DoodlerInterface } from '@/types/models/doodler';

export const CROWN_COLORS = ['#f7e99e', '#c0c0c0', '#cd7f32']; // gold, silver, bronze

const distinctScores = (doodlers: DoodlerInterface[]) =>
  [...new Set(doodlers.map(({ score }) => score))].sort((a, b) => b - a);

// Dense rank (1-based): tied scores share a place.
export const getDenseRank = (doodlers: DoodlerInterface[], score: number) =>
  distinctScores(doodlers).indexOf(score) + 1;

// 0 = gold, 1 = silver, 2 = bronze; nobody gets a crown before anyone has scored.
export const getCrownRank = (doodlers: DoodlerInterface[], score: number) => {
  const rank = distinctScores(doodlers)
    .filter((s) => s > 0)
    .slice(0, 3)
    .indexOf(score);
  return rank === -1 ? undefined : rank;
};

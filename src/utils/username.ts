import {
  adjectives,
  animals,
  colors,
  countries,
  languages,
  names,
  NumberDictionary,
  starWars,
  uniqueNamesGenerator,
} from 'unique-names-generator';

const DESCRIBERS = [adjectives, colors];
const SUBJECTS = [animals, names, countries, languages, starWars];

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

// Some entries are multi-word ("South Georgia & South Sandwich Islands"), so
// squash everything into one PascalCase token.
const toPascalCase = (text: string) =>
  text
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

// e.g. "TealOtter42" - the number keeps two random players in a room from clashing.
export const generateUsername = () =>
  toPascalCase(
    uniqueNamesGenerator({
      dictionaries: [
        pick(DESCRIBERS),
        pick(SUBJECTS),
        NumberDictionary.generate({ min: 10, max: 99 }),
      ],
      separator: ' ',
    })
  );

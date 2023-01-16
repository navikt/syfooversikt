export const uppercaseFirstLetter = (word: string): string => {
  return `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
};

export const capitalizeHyphenatedWords = (word: string): string => {
  return word.split('-').map(uppercaseFirstLetter).join('-');
};

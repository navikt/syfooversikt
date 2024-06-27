export const uppercaseFirstLetter = (word: string): string => {
  return `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
};

export const capitalizeHyphenatedWords = (word: string): string => {
  return word.split('-').map(uppercaseFirstLetter).join('-');
};

export const toLastnameFirstnameFormat = (navn: string): string => {
  if (!navn.length) return '';
  const nameList = navn.split(' ');

  if (nameList.length > 1) {
    const lastName = nameList.pop() || '';
    nameList.unshift(`${lastName},`);
  }

  return nameList.map(capitalizeHyphenatedWords).join(' ');
};

module.exports = (name) => {
  let fix_name = '';
  const array_name = name.split(',');
  if (array_name.length > 1) {
    if (articles.includes(array_name[1].trim())) {
      fix_name = `${array_name[1]} ${array_name[0]}`;
    } else {
      for (let i = 0; i < name.length; i++) {
        const letter = name[i];
        if (!marcks.includes(letter)) {
          fix_name += letter;
        }
      }
    }
  } else {
    fix_name = name;
  }

  return fix_name;
};

const articles = [
  'al',
  'el',
  'il',
  'ol',
  'ul',
  'la',
  'le',
  'li',
  'lo',
  'lu',
  'a',
  'an',
  'the',
  'of',
  'de',
  'del',
  'las',
  'les',
  'lis',
  'los',
  'lus',
];

const marcks = ['.', ',', ':', ';', '-', '_', "'", '"', '`', '´'];

module.exports = (name) => {
  let fix_name = '';
  const array_name = name.split(',');
  if (array_name.length > 1) {
    if (articles.includes(array_name[1].trim())) {
      fix_name = `${array_name[1]} ${array_name[0]}`;
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

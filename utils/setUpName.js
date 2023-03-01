module.exports = (name) => {
  let fix_name = '';
  // Por defecto, convertimos en minúsculas
  const name_lower = name.toLowerCase();
  // Comprobamos si name trae ','
  const array_name_coma = name_lower.split(',');
  if (array_name_coma.length > 1) {
    // Comprobamos si ya viene maqueado (si tras la ',', hay un articulo)
    // libro, el
    if (articles.includes(array_name_coma[1].trim())) {
      // Si viene maqueado, nos lo quedamos
      fix_name = name_lower;
      return fix_name;
    }
  }

  // Si no trae ','. A currar
  // Separamos lo que viene por los espacios
  const array_name = name_lower.split(' ');
  // Si la primera palabra es un artículo
  if (articles.includes(array_name[0])) {
    // Maqueamos el resultado
    const first_word = array_name[0].trim();
    // Nos quedamos con el index del primer espacio
    const index_f_space = name_lower.indexOf(' ');
    // Cortamos a partir de ahi
    const rest_name = name_lower.slice(index_f_space);
    // Montamos la frase final
    fix_name = `${rest_name}, ${first_word}`;
  } else {
    // Si no está incluida, devolvemos lo que viene
    fix_name = name_lower;
  }

  return fix_name;
};

const articles = [
  'a',
  'al',
  'ante',
  'con',
  'de',
  'del',
  'desde',
  'en',
  'el',
  'la',
  'le',
  'lo',
  'las',
  'les',
  'los',
  'para',
  'por',
  'so',
  'un',
  'una',
  'unos',
  'unas',
  'the',
  'of',
  'y',
  'o',
  'e',
];

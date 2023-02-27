module.exports = (name) => {
  let fix_name = '';
  // Forzamos minúsculas por defecto
  const name_lower = name.toLowerCase();
  // Comprobamos si ya viene maqueado
  const array_coma = name.split(',');
  if (array_coma.length > 1) {
    // Ya viene maqueado
    fix_name = name_lower;
  } else {
    // Hay que currar en él
    // Comprobamos si viene solo un nombre, sin apellidos
    const array_name = name_lower.split(' ');
    if (array_name.length > 1) {
      // Cogemos la primer palabra
      const first_word = name_lower.split(' ')[0];
      // Buscamos el primer espacio y asumimos que el resto es el apellido
      const index_f_word = name_lower.indexOf(' ');
      const rest_name = name_lower.slice(index_f_word);
      // Montamos el resultado final
      fix_name = `${rest_name}, ${first_word}`;
    } else {
      fix_name = name_lower;
    }
  }
  return fix_name;
};

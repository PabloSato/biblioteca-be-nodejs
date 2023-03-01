module.exports = (name) => {
  if (name == 'vv.aa') {
    return name;
  }
  let fix_name = name;
  if (name.indexOf(',') > -1) {
    const lastName = name.split(',')[0].trim();
    const firstName = name.split(',')[1].trim();
    fix_name = `${firstName} ${lastName}`;
  }
  return fix_name;
};

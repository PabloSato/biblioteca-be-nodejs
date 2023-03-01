// -- SET ORDER NAME --
exports.setOrderName = (req, res, next) => {
  req.query.sort = 'name';
  next();
};
// -- BY SLUG --
exports.getBySlug = (req, res, next) => {
  const filter = { slug: req.params.slug };
  req.query.filter = filter;
  next();
};
// -- BY NAME --
exports.getByName = (req, res, next) => {
  const name = req.params.name;
  const filter = { $text: { $search: name, $caseSensitive: false } };
  req.query.filter = filter;
  next();
};
// -- BY RACK --
exports.getByRack = (req, res, next) => {
  const filter = { rack: req.params.rackId };
  req.query.filter = filter;
  next();
};
// -- BY LOCATION --
exports.getByLocation = (req, res, next) => {
  const filter = { location: req.params.locationId };
  req.query.filter = filter;
  next();
};

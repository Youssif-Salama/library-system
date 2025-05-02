/**
 * Attaches a get query to the request object.
 * @param {Model} model A mongoose model.
 * @returns {function} A middleware function.
 */
const attachGetQuery = (model) => (req, res, next) => {
  req.dbQuery = model.find();
  next();
};

/**
 * Attaches an update query to the request object.
 * @param {Model} model A mongoose model.
 * @returns {function} A middleware function.
 */
const attachUpdateQuery = (model) => (req, res, next) => {
  req.dbQuery=model.updateMany({},req.body,{new:true});
  next();
}

/**
 * Attaches a delete query to the request object.
 * @param {Model} model A mongoose model.
 * @returns {function} A middleware function.
 */
const attachDeleteQuery = (model) => (req, res, next) => {
  req.dbQuery=model.deleteMany();
  next();
}

/**
 * Attaches a create query to the request object.
 * @param {Model} model A mongoose model.
 * @returns {function} A middleware function.
 */
const attachCreateQuery = (model) => (req, res, next) => {
  req.dbQuery=model.create(req.body);
  next();
}

export {
  attachGetQuery,
  attachUpdateQuery,
  attachDeleteQuery,
  attachCreateQuery
}

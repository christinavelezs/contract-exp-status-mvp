const AppError = require('../errors/AppError');

function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(new AppError('Datos inválidos', 400, result.error.flatten()));
    }
    req[source] = result.data;
    next();
  };
}

module.exports = validate;

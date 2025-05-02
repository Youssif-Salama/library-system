import CatchErrorService, { AppError } from "../services/error.services.js";

export const filterQueryMiddleware = ({field, value}) =>
  CatchErrorService(async (req, res, next) => {
    console.log({rdb:req.dbQuery});

    if (!req.dbQuery) {
      throw new AppError('Database query not found on request object', 500);
    }
    req.dbQuery = req.dbQuery.where({ [field]: req.params[value] });
    next();
  });

export const highLevelFilterQueryMiddleware = ({ field, value, case: compareType }) => {
  if (!field || !value || !compareType) {
    return next();
  }

  const validOperators = ['equals', 'ne', 'gt', 'lt', 'gte', 'lte'];
  if (!validOperators.includes(compareType)) {
    throw new AppError(`Invalid comparison operator. Must be one of: ${validOperators.join(', ')}`, 400);
  }

  const operatorMap = {
    equals: '$eq',
    ne: '$ne',
    gt: '$gt',
    lt: '$lt',
    gte: '$gte',
    lte: '$lte'
  };

  return CatchErrorService(async (req, res, next) => {
    if (!req.dbQuery) {
      throw new AppError('Database query not found on request object', 500);
    }

    if (!req.query[value]) {
      throw new AppError(`Parameter ${value} not found in request parameters`, 400);
    }

    const condition = { [operatorMap[compareType]]: req.query[value] };
    req.dbQuery = req.dbQuery.where({ [field]: condition });

    next();
  });
};
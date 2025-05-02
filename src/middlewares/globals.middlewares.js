import CatchErrorService, { AppError } from "../services/error.services.js";

/**
 * @description A middleware that handles database query execution.
 * @param {Object} responseObj - An object with two properties: success and failure.
 * The success property must contain a status (number) and a message (string).
 * The failure property must contain a status (number) and a message (string).
 * @returns {function} A middleware function.
 */
const execution = (responseObj, cb) =>
  CatchErrorService(async (req, res) => {
    if (!responseObj?.success || !responseObj?.failure) {
      throw new AppError("Invalid response object configuration", 500);
    }

    const { success: successObj, failure: failureObj } = responseObj;

    if (!req.dbQuery) {
      throw new AppError("Database query not found on request object", 500);
    }

    const result = await req.dbQuery;

    // Execute callback function if provided
    const callbackResult = cb ? await cb(result) : true;

    if (result && callbackResult) {
      return res.status(successObj.status).json({
        status: successObj.status,
        message: successObj.message,
        data: result,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(failureObj.status).json({
      status: failureObj.status,
      message: failureObj.message,
      timestamp: new Date().toISOString(),
    });
  });

export const validator = (schema) => {
  return CatchErrorService(async (req, res, next) => {
    const { error } = await schema.validateAsync(req.body);
    if (error) {
      let errorsMessages = error.details.map((err) => err.message);
      let errors = errorsMessages.join(",");
      throw new AppError(errors, 400);
    }
    next();
  });
};

export default execution;

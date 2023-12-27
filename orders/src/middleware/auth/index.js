const { AuthorizationError } = require("../../utils/errors/app-errors");
const { ValidateSignature } = require("../../utils/helpers");

const Auth = async (req, res, next) => {
  try {
    const result = await ValidateSignature(req);
    next();
  } catch (e) {
    const err = new AuthorizationError(e);
    next(err);
  }
};

module.exports = {
  Auth,
};

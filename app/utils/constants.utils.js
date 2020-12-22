// tokens constants
module.exports.ERROR_MESSAGE_RESET_PASSWORD_TOKEN_EXPIRED =
  "Token expired, generate a new one";
module.exports.ERROR_MESSAGE_NO_TOKEN_PROVIDED = "No token provided.";
module.exports.ERROR_MESSAGE_TOKEN_ERROR = "Token error.";
module.exports.ERROR_MESSAGE_TOKEN_EXPIRED = "Token expired.";
module.exports.ERROR_MESSAGE_TOKEN_MALFORMATTED = "Token malformatted.";
module.exports.ERROR_MESSAGE_INVALID_TOKEN = "Invalid token.";
module.exports.ERROR_MESSAGE_INVALID_TOKEN_RESET_PASSWORD =
  "Invalid token for reseting password.";
module.exports.ERROR_MESSAGE_MISSING_TOKEN_REQUIRED_PARAMETERS =
  "Token without required parameters.";
module.exports.ERROR_MESSAGE_USER_NOT_ACTIVATED = "User is not active.";
module.exports.ERROR_MESSAGE_NO_USER_INFORMATION = "No user information.";
module.exports.ERROR_MESSAGE_MISSING_USER_ID = "Missing user id.";
module.exports.ERROR_MESSAGE_MISSING_USER_ROLES = "Missing user roles.";
module.exports.ERROR_MESSAGE_MALFORMATED_USER_ROLES =
  "Invalid user roles format.";
module.exports.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS =
  "User does not have enough permissions to access.";
module.exports.TOKEN_USER_INFO_ROLES_SPLIT_CHAR = ";";
module.exports.REQUEST_USER_TOKEN_PARAMETER = "X-User-Token";
module.exports.REQUEST_BASE_URL_PARAMETER = "X-Original-URI";

// authentication constants
module.exports.PASSWD_HASH_SIZE = 10;
module.exports.ERROR_MESSAGE_AUTHENTICATION_FAILED = "Authentication failed";
module.exports.ERROR_MESSAGE_ACCESS_DENIED = "Access denied";

// Common ERROR codes constants
module.exports.STATUS_CODE_OK = 200;
module.exports.STATUS_CODE_BAD_REQUEST = 400;
module.exports.STATUS_CODE_ACCESS_UNAUTHORIZED = 401;
module.exports.STATUS_CODE_NOT_FOUND = 404;
module.exports.STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
module.exports.STATUS_CODE_SERVICE_UNAVAILABLE = 503;
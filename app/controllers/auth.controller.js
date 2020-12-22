const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.config.json");
const constantsUtils = require("../utils/constants.utils");
const tokenUtils = require("../utils/token.utils");

const Cryptr = require("cryptr");
const cryptr = new Cryptr(authConfig.tokenParamsSecret);

const logger = require("../controllers/logger.controller");

exports.healthCheck = async (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  };
  try {
    res.send(healthCheck);
  } catch (e) {
    healthCheck.message = e;
    res.status(constantsUtils.STATUS_CODE_SERVICE_UNAVAILABLE).send();
  }
};

module.exports.tokenVerification = async (req, res) => {
  const url = req.get(constantsUtils.REQUEST_BASE_URL_PARAMETER);
  const baseUserUrlWhiteList = [
    "/api/v0/users/register",
    "/api/v0/users/authenticate",
    "/api/v0/users/forgotPassword/",
    "/api/v0/acronyms",
  ];
  regex = new RegExp(baseUserUrlWhiteList.join("|"));
  if (regex.test(url)) return res.status(constantsUtils.STATUS_CODE_OK).send();

  const authHeader = req.headers.authorization;

  const result = extractToken(authHeader);
  if (!result.token) {
    logger.log("tokenVerification", result.errorMessage);
    return res.status(result.errorCode).send({
      error: result.errorMessage
    });
  }

  var userInfo = null;
  jwt.verify(result.token, authConfig.secret, (err, decoded) => {
    if (err) {
      logger.log("tokenVerification", constantsUtils.ERROR_MESSAGE_TOKEN_EXPIRED, err);
      return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED).send({
        error: constantsUtils.ERROR_MESSAGE_TOKEN_EXPIRED,
        authorized: false,
      });
    }

    const decryptedData = cryptr.decrypt(decoded.params);
    userInfo = JSON.parse(decryptedData);

    if (!userInfo.status || userInfo.status !== tokenUtils.ACTIVE_USER_STATUS) {
      logger.log("tokenVerification", constantsUtils.ERROR_MESSAGE_USER_NOT_ACTIVATED);
      return res
        .status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED)
        .send({
          error: constantsUtils.ERROR_MESSAGE_USER_NOT_ACTIVATED
        });
    }

    return res.send();
  });
};

function extractToken(authHeader) {
  if (!authHeader)
    return {
      errorCode: constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED,
      errorMessage: constantsUtils.ERROR_MESSAGE_NO_TOKEN_PROVIDED,
    };

  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return {
      errorCode: constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED,
      errorMessage: constantsUtils.ERROR_MESSAGE_TOKEN_ERROR,
    };

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return {
      errorCode: constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED,
      errorMessage: constantsUtils.ERROR_MESSAGE_TOKEN_MALFORMATTED,
    };

  return {
    token: token
  };
}

module.exports.generateToken = async (req, res) => {
  const params = cryptr.encrypt(JSON.stringify(req.body.data));
  const token = jwt.sign({
    params: params
  }, authConfig.secret, {
    expiresIn: "1d",
  });

  return res.send({
    token: token
  });
};

module.exports.validateUserStatus = (req, res) => {
  const result = extractToken(
    req.get(constantsUtils.REQUEST_USER_TOKEN_PARAMETER)
  );

  if (!result.token) {
    logger.log("validateUserStatus", result.errorMessage);
    return res.status(result.errorCode).send({
      error: result.errorMessage
    });
  }

  var userInfo = null;
  jwt.verify(result.token, authConfig.secret, (err, decoded) => {
    if (err) {
      logger.log("validateUserStatus", constantsUtils.ERROR_MESSAGE_TOKEN_EXPIRED, err);
      return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED).send({
        error: constantsUtils.ERROR_MESSAGE_TOKEN_EXPIRED,
        authorized: false,
      });
    }

    const decryptedData = cryptr.decrypt(decoded.params);
    userInfo = JSON.parse(decryptedData);
  });

  if (!userInfo.id) {
    logger.log("validateUserStatus", constantsUtils.ERROR_MESSAGE_MISSING_USER_ID);
    return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED).send({
      error: constantsUtils.ERROR_MESSAGE_MISSING_USER_ID,
      authorized: false,
    });
  }

  if (!userInfo.status || userInfo.status !== tokenUtils.ACTIVE_USER_STATUS) {
    logger.log("validateUserStatus", constantsUtils.ERROR_MESSAGE_USER_NOT_ACTIVATED);
    return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED).send({
      error: constantsUtils.ERROR_MESSAGE_USER_NOT_ACTIVATED,
      authorized: false,
    });
  }

  if (!userInfo.roles) {
    logger.log("validateUserStatus", constantsUtils.ERROR_MESSAGE_MISSING_USER_ROLES);
    return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED).send({
      error: constantsUtils.ERROR_MESSAGE_MISSING_USER_ROLES,
      authorized: false,
    });
  }

  userInfo.roles = userInfo.roles.split(
    constantsUtils.TOKEN_USER_INFO_ROLES_SPLIT_CHAR
  );
  if (!Array.isArray(userInfo.roles)) {
    logger.log("validateUserStatus", constantsUtils.ERROR_MESSAGE_MALFORMATED_USER_ROLES);
    return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED).send({
      error: constantsUtils.ERROR_MESSAGE_MALFORMATED_USER_ROLES,
      authorized: false,
    });
  }

  if (
    !userInfo.roles.includes(tokenUtils.USER_ADMIN_ROLE) ||
    userInfo.roles.includes(tokenUtils.USER_NONE_ROLE)
  ) {
    logger.log("validateUserStatus", constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS);
    return res.status(constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED).send({
      error: constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS,
      authorized: false,
    });
  }

  return res.send({
    authorized: true
  });
};
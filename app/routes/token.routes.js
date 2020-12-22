module.exports = (app) => {
  const authController = require("../controllers/auth.controller");

  const tokenRateLimit = require("../middleware/token-rate-limit");

  var router = require("express").Router();

  router.get("/healthcheck", authController.healthCheck);

  router.get("/",
    tokenRateLimit.tokenVerificationLimit,
    authController.tokenVerification
  );

  router.post(
    "/generateToken",
    tokenRateLimit.tokenGenerationLimit,
    authController.generateToken
  );

  router.get("/validateUserStatus", authController.validateUserStatus);

  app.use("/api/v0/auth", router);
};
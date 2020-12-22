const rateLimit = require("express-rate-limit");

const tokenGenerationLimit = exports.tokenGenerationLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: process.env.API_GENERATION_TOKEN_RATE_LIMIT
});

const tokenVerificationLimit = exports.tokenVerificationLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: process.env.API_VERIFICATION_TOKEN_RATE_LIMIT
});

exports.tokenGenerationLimit = tokenGenerationLimit;
exports.tokenVerificationLimit = tokenVerificationLimit;
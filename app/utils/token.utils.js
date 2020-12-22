const jwt = require('jsonwebtoken');
const authConfig = require("../../config/auth.config.json");

const Cryptr = require('cryptr');
const cryptr = new Cryptr(authConfig.tokenParamsSecret);

// used only for tests
module.exports.TOKEN_PREFIX = "Bearer ";
module.exports.EXPIRED_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTk0MTU0MzIwLCJleHAiOjE1OTQyNDA3MjB9.AoqK_lkeyrPUMtQUKxIxDPT33dkszUB9GKlaW_-02d4";
module.exports.TOKEN_MALFORMATTED = "InvalidTokenPrefix eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTk0MTU0MzIwLCJleHAiOjE1OTQyNDA3MjB9.AoqK_lkeyrPUMtQUKxIxDPT33dkszUB9GKlaW_-02d4";
module.exports.INVALID_TOKEN = "Invalid Token Prefix eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTk0MTU0MzIwLCJleHAiOjE1OTQyNDA3MjB9.AoqK_lkeyrPUMtQUKxIxDPT33dkszUB9GKlaW_-02d4";
module.exports.TOKEN_GENERATION_USER_ID = 999999;

module.exports.ACTIVE_USER_STATUS = 'active';
module.exports.INNACTIVE_USER_STATUS = 'innactive';
module.exports.BANNED_USER_STATUS = 'banned';
module.exports.DELETED_USER_STATUS = 'deleted';

module.exports.USER_NONE_ROLE = 'none';
module.exports.USER_ROLE = 'role';
module.exports.USER_ADMIN_ROLE = 'admin';

module.exports.generateValidToken = async (status, roles) => {
    const userInfo = {
        id: this.TOKEN_GENERATION_USER_ID,
        status: status,
        roles: roles
    };
    const params = cryptr.encrypt(JSON.stringify(userInfo));
    return jwt.sign({
        params: params
    }, authConfig.secret, {
        expiresIn: "1d"
    });
};

module.exports.generateValidTokenWithoutId = async (status, roles) => {
    const userInfo = {
        status: status,
        roles: roles
    };
    const params = cryptr.encrypt(JSON.stringify(userInfo));
    return jwt.sign({
        params: params
    }, authConfig.secret, {
        expiresIn: "1d"
    });
};

module.exports.generateValidTokenWithoutRoles = async (status) => {
    const userInfo = {
        id: this.TOKEN_GENERATION_USER_ID,
        status: status
    };
    const params = cryptr.encrypt(JSON.stringify(userInfo));
    return jwt.sign({
        params: params
    }, authConfig.secret, {
        expiresIn: "1d"
    });
};

module.exports.generateValidTokenWithoutParams = async () => {
    const userInfo = {};
    const params = cryptr.encrypt(JSON.stringify(userInfo));
    return jwt.sign({
        params: params
    }, authConfig.secret, {
        expiresIn: "1d"
    });
};
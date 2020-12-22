const tokenUtils = require("../../../utils/token.utils");
const constantsUtils = require("../../../utils/constants.utils");

const request = require("supertest");
const app = require("../../../server");

describe("GET /api/v0/auth", () => {
  test("Test that requests return a bad request when no token is provided", async () => {
    const response = await request(app).get("/api/v0/auth");

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_NO_TOKEN_PROVIDED
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that requests return a bad request when token is invalid", async () => {
    const response = await request(app)
      .get("/api/v0/auth")
      .set({
        Authorization: tokenUtils.INVALID_TOKEN
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(constantsUtils.ERROR_MESSAGE_TOKEN_ERROR);
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that requests is blocked when token is malformatted", async () => {
    const response = await request(app)
      .get("/api/v0/auth")
      .set({
        Authorization: tokenUtils.TOKEN_MALFORMATTED
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_TOKEN_MALFORMATTED
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Tests that requests is blocked when token is expried", async () => {
    const response = await request(app)
      .get("/api/v0/auth")
      .set({
        Authorization: tokenUtils.EXPIRED_TOKEN
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_TOKEN_EXPIRED
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Tests that user status validation is blocked when token is expried", async () => {
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": tokenUtils.EXPIRED_TOKEN
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_TOKEN_EXPIRED
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that requests is processed properly when user has a valid token and is active", async () => {
    const token = await tokenUtils.generateValidToken(
      tokenUtils.ACTIVE_USER_STATUS,
      tokenUtils.USER_ADMIN_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
    expect(response.body.authorized).toBeTruthy();
  });

  test("Test that requests is unauthorized when user is innactive", async () => {
    const token = await tokenUtils.generateValidToken(
      tokenUtils.INNACTIVE_USER_STATUS,
      tokenUtils.USER_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_USER_NOT_ACTIVATED
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that requests is unauthorized when user is banned", async () => {
    const token = await tokenUtils.generateValidToken(
      tokenUtils.BANNED_USER_STATUS,
      tokenUtils.USER_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_USER_NOT_ACTIVATED
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that requests is unauthorized when user is deleted", async () => {
    const token = await tokenUtils.generateValidToken(
      tokenUtils.DELETED_USER_STATUS,
      tokenUtils.USER_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_USER_NOT_ACTIVATED
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that user status validation is unauthorized when user has no role", async () => {
    const token = await tokenUtils.generateValidToken(
      tokenUtils.ACTIVE_USER_STATUS,
      tokenUtils.USER_NONE_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that user status validation is unauthorized when user id is not included in jwt token", async () => {
    const token = await tokenUtils.generateValidTokenWithoutId(
      tokenUtils.ACTIVE_USER_STATUS,
      tokenUtils.USER_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_MISSING_USER_ID
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that user status validation is unauthorized when neither user id, status or role is not included in jwt token", async () => {
    const token = await tokenUtils.generateValidTokenWithoutParams(
      tokenUtils.ACTIVE_USER_STATUS,
      tokenUtils.USER_NONE_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_MISSING_USER_ID
    );
    expect(response.body.authorized).toBeFalsy();
  });

  test("Test that user status validation is unauthorized when user has either none and admin roles", async () => {
    const token = await tokenUtils.generateValidToken(
      tokenUtils.ACTIVE_USER_STATUS,
      tokenUtils.USER_NONE_ROLE + ";" + tokenUtils.USER_ADMIN_ROLE
    );
    const response = await request(app)
      .get("/api/v0/auth/validateUserStatus")
      .set({
        "X-User-Token": "Bearer " + token
      });

    expect(response.status).toBe(
      constantsUtils.STATUS_CODE_ACCESS_UNAUTHORIZED
    );
    expect(response.body.error).toBe(
      constantsUtils.ERROR_MESSAGE_USER_NOT_ENOUGH_RIGHTS
    );
    expect(response.body.authorized).toBeFalsy();
  });
});

describe("GET /api/v0/users/authenticate", () => {
  test("Test that requests does not need any token to authenticate an user", async () => {
    const response = await request(app)
      .get("/api/v0/auth")
      .set({
        "X-Original-URI": "/api/v0/users/authenticate"
      });

    expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
  });
});

describe("GET /api/v0/users/register", () => {
  test("Test that requests does not need any token to register a new user", async () => {
    const userResponse = await request(app)
      .get("/api/v0/auth")
      .set({
        "X-Original-URI": "/api/v0/users/register"
      });

    expect(userResponse.status).toBe(constantsUtils.STATUS_CODE_OK);
  });
});

describe("GET /api/v0/users/forgotPassword", () => {
  test("Test that requests does not need any token to generate a new password when user forgets", async () => {
    const response = await request(app)
      .get("/api/v0/auth")
      .set({
        "X-Original-URI": "/api/v0/users/forgotPassword/"
      });

    expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
  });
});

describe("GET /api/v0/acronyms", () => {
  test("Test that requests does not need any token to access acronyms service", async () => {
    const response = await request(app)
      .get("/api/v0/auth")
      .set({
        "X-Original-URI": "/api/v0/acronyms/forgotPassword/"
      });

    expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
  });
});

describe('GET HealthCheck', () => {

  test('Returns 200 if server is healthy', async () => {
    const response = await request(app).get(`/api/v0/auth/healthcheck`);
    expect(response.status).toBe(constantsUtils.STATUS_CODE_OK);
    expect(response.body.uptime).toBeGreaterThan(0);
  });
});
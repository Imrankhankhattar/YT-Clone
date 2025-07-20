const express = require("express");

const passport = require("../config/passport");
const errorResponse = require("../utils/error");
const { generateToken } = require("../utils/jwt");
const config = require("../config");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/redirect",
  passport.authenticate("google", { failWithError: true, session: false }),
  function (req, res) {
    const user = req.user;

    try {
      //Generate our own token from our google user
      const token = generateToken({
        id: user._id.toHexString(),
        secret: config.JWT_SECRET,
        errorMessage: null,
      });
      //Send credential cookies
      res
        .cookie("jwt_auth", token, {
          maxAge: config.SESSION_DURATION * 60 * 1000,
          httpOnly: true,
          sameSite: config.NODE_ENV === "production" ? "none" : "lax",
          secure: config.NODE_ENV === "production",
          path: "/"
        })
        .json({ success: true });
    } catch (err) {
      errorResponse(err, res);
    }
  },
  function (err, req, res) {
    errorResponse(err, res);
  }
);
router.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("jwt_auth").json({ message: "success" });
});

// Debug endpoint to check JWT configuration
router.get("/debug", (req, res) => {
  res.json({
    jwtSecret: config.JWT_SECRET ? "Set" : "Not set",
    sessionDuration: config.SESSION_DURATION,
    nodeEnv: config.NODE_ENV,
    clientUrl: config.CLIENT_URL,
    backendUrl: config.BACKEND_URL,
    receivedCookies: req.cookies,
    jwtAuthCookie: req.cookies.jwt_auth ? "Present" : "Missing",
    cookieSettings: {
      maxAge: config.SESSION_DURATION * 60 * 1000,
      httpOnly: true,
      sameSite: config.NODE_ENV === "production" ? "none" : "lax",
      secure: config.NODE_ENV === "production",
    }
  });
});

// Test endpoint to manually set a cookie
router.get("/test-cookie", (req, res) => {
  const testToken = generateToken({
    id: "test-user-id",
    secret: config.JWT_SECRET,
    errorMessage: null,
  });
  
  res.cookie("jwt_auth", testToken, {
    maxAge: config.SESSION_DURATION * 60 * 1000,
    httpOnly: true,
    sameSite: config.NODE_ENV === "production" ? "none" : "lax",
    secure: config.NODE_ENV === "production",
    path: "/"
  }).json({
    message: "Test cookie set",
    token: testToken.substring(0, 20) + "...",
    origin: req.headers.origin,
    referer: req.headers.referer
  });
});

// Test endpoint to check if cookies are being sent from frontend
router.get("/test-frontend-cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    headers: {
      origin: req.headers.origin,
      referer: req.headers.referer,
      'user-agent': req.headers['user-agent']
    },
    jwtAuthPresent: !!req.cookies.jwt_auth
  });
});

module.exports = router;

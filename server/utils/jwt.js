const jwt = require("jsonwebtoken");
const config = require("../config");

const generateToken = ({ id, errorMessage, secret }) => {
  try {
    const token = jwt.sign({ id }, secret, {
      expiresIn: `${config.SESSION_DURATION}m`,
    });
    return token;
  } catch (err) {
    throw errorMessage || err;
  }
};

const verifyToken = ({ token, errorMessage, secret }) => {
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    if (!secret) {
      throw new Error("No secret provided");
    }
    const jwToken = jwt.verify(token, secret);
    return jwToken.id;
  } catch (err) {
    console.log("JWT Verification Error:", err.message);
    throw errorMessage || err;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

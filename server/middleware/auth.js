const { verifyToken } = require("../utils/jwt");
const errorResponse = require("../utils/error");
const config = require("../config");

//Responses with error if not auth (strict auth)
const auth = (req, res, next) => {
  //Get cookies
  const token = req.cookies.jwt_auth;
  console.log("Auth middleware - Token:", token ? "Present" : "Missing");
  console.log("Auth middleware - JWT_SECRET:", config.JWT_SECRET ? "Set" : "Missing");
  
  try {
    //Verify token
    const signedUserId = verifyToken({
      token,
      secret: config.JWT_SECRET,
      errorMessage: null,
    });

    //Add User to payload
    req.userId = signedUserId;
    next();
  } catch (err) {
    console.log("Auth middleware error:", err.message);
    errorResponse(err, res);
  }
};

//Doesn't response w/ error if not auth
const auth2 = (req, res, next) => {
  //Get cookies
  const token = req.cookies.jwt_auth;
  try {
    //Verify token
    const signedUserId = verifyToken({
      token,
      secret: config.JWT_SECRET,
      errorMessage: null,
    });

    //Add User to payload
    req.userId = signedUserId;
    next();
  } catch (err) {
    req.userError = err;
    next();
  }
};

module.exports = { auth, auth2 };

const jwt = require("jsonwebtoken");
const { User } = require("../models/authModel");
// module.exports.authMiddleware = async (req, res, next) => {
//   const token = req.cookies.userToken;
//   console.log(token);
//   if (!token) {
//     return next(
//       res.status(401).send({
//         error: "Unauthorized User",
//       })
//     );
//   }
//   jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//     if (err) {
//       return next(
//         res.status(401).send({
//           error: "Unauthorized User",
//         })
//       );
//     }
//     req.user = user;
//     next();
//   });
// };

// User Auth
const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split("Bearer ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Unauthorized User",
      });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized User",
        });
      }
      req.user = user;
    });
    next();
  }
};

const isAdmin = async (req, res, next) => {
  console.log(req.user);
  // if (req.user.role !== "admin") {
  //   return res.status(404).send({
  //     success: false,
  //     message: " Admin Only Access",
  //   });
  // }
  next();
};

module.exports = { isAdmin, isAuth };

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/* checkAuth Middleware */
const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.jwt = user;
        next();
      } catch (e) {
        res.status(401).json({ Error: "Invalid/Expired token" });
      }
    } else {
      res
        .status(400)
        .json({ Error: "Authentication token most be 'Bearer [token]" });
    }
  } else {
    res.status(400).json({ Error: "Authorization header must be provided" });
  }
};

export { checkAuth };

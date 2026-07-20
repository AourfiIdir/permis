import jwt from "jsonwebtoken"

export default function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  const bearerToken = token && token.split(' ')[1];

  if (!bearerToken) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

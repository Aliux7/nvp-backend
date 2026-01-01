import jwt from "jsonwebtoken";

export const verifyToken = (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ valid: false, message: "Token not found" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  
    return res.status(200).json({
      valid: true,
      user: decoded,
    });
  } catch (err) { 
    return res.status(401).json({
      valid: false,
      message: "Invalid or expired token",
    });
  }
};

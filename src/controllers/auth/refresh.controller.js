import jwt from "jsonwebtoken";

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken; 
  if (!token) return res.sendStatus(401);

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const newAccessToken = jwt.sign(
    { id: decoded.id, email: decoded.email, role: decoded.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.json({
    accessToken: newAccessToken,
    user: decoded,
  });
};

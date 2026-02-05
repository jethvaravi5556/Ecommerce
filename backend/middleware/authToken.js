import jwt from "jsonwebtoken";

async function authToken(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please Login...!",
        error: true,
        success: false,
      });
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
  if (err) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
      error: true,
      success: false,
    });
  }

  console.log("Decoded Token:", decoded);
  req.userId = decoded._id || decoded.id; // ✅ Check both _id and id
  next();
});

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
}

export default authToken;

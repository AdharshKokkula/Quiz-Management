// auth/basicAuth.js
import express from "express";

const router = express.Router();

// Middleware for Basic Auth
router.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="My Realm"');
    return res.status(401).send("Text to send if user hits Cancel button");
  }

  // Decode base64 username:password
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [PHP_AUTH_USER, PHP_AUTH_PW] = credentials.split(":");

  // Attach to req object for access in routes
  req.PHP_AUTH_USER = PHP_AUTH_USER;
  req.PHP_AUTH_PW = PHP_AUTH_PW;

  next();
});

// Route
router.get("/logout", (req, res) => {
  const { PHP_AUTH_USER, PHP_AUTH_PW } = req;
  res.send(
    `<p>Hello ${PHP_AUTH_USER}.</p><p>You entered ${PHP_AUTH_PW} as your password.</p>`
  );
});

export default router;

import express from "express";
import crypto from "crypto";

const router = express.Router();

function getIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown"
  );
}

// Hash helper functions
function md5(data) {
  return crypto.createHash("md5").update(data).digest("hex");
}

function sha1(data) {
  return crypto.createHash("sha1").update(data).digest("hex");
}

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function sha512(data) {
  return crypto.createHash("sha512").update(data).digest("hex");
}

// API route
router.get("/hash-ip", (req, res) => {
  const ip = getIP(req);

  res.json({
    original: ip,
    md5: md5(ip),
    SHA1: sha1(ip),
    SHA256: sha256(ip),
    SHA512: sha512(ip),
    "md5(SHA1)": md5(sha1(ip)),
    "md5(SHA256)": md5(sha256(ip)),
    "md5(SHA512)": md5(sha512(ip)),
  });
});

// Root route for /api/test
router.get("/", (req, res) => {
  res.send(" IP Hash API running. Access /api/test/hash-ip");
});

export default router;

const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");
// const isAuthenticated = require("../middlewares/isAuthenticated");

// Route interrogée lors de l'inscription d'un utilisateur
router.post("/user/sign_up", async (req, res) => {
  const user = await User.findOne({ email: req.fields.email });

  if (user) {
    res.json({ message: "This email is already taken." });
  } else {
    if (req.fields.email && req.fields.password && req.fields.username) {
      const token = uid2(64);
      const salt = uid2(64);
      const hash = SHA256(req.fields.password + salt).toString(encBase64);
      const user = new User({
        email: req.fields.email,
        token: token,
        salt: salt,
        hash: hash,
        account: {
          username: req.fields.username,
          phone: req.fields.phone
        }
      });

      await user.save();
      // ne renvoyer que les données non sensibles et utiles côté client
      res.json({
        _id: user._id,
        token: user.token,
        account: user.account
      });
    } else {
      res.json({ error: "Missing parameter(s)" });
    }
  }
});

// Route interrogée lors de la connexion d'un utilisateur
router.post("/user/log_in", async (req, res, next) => {
  const user = await User.findOne({ email: req.fields.email });
  if (user) {
    if (
      SHA256(req.fields.password + user.salt).toString(encBase64) === user.hash
    ) {
      // le mot de passe saisi lors du login est le bon
      res.json({
        _id: user._id,
        token: user.token,
        account: user.account
      });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.json({ message: "User not found" });
  }
});

// router.post("/user/test", isAuthenticated, async (req, res) => {
//   console.log(req.user);
//   res.json({ message: "Test route" });
// });

module.exports = router;

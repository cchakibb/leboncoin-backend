const User = require("../models/User.js");

const isAuthenticated = async (req, res, next) => {
  // checker si le user il est bien authentifié
  //   console.log(req.headers.authorization);
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", "")
    });
    if (!user) {
      return res.json({ error: "Unauthorized" });
    } else {
      req.user = user; // crée une clé "user" dans req. Côté route, on va pouvoir récupérer req.user
      next(); // permet de passer à la suite et de rentrer dans la route (obligaoire, sinon il n'y aura jamais de réponse de la route)
    }
  } else {
    return res.json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;

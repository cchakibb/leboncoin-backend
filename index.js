const mongoose = require("mongoose");
const express = require("express");
const app = express();
const formidableMiddleware = require("express-formidable");
app.use(formidableMiddleware());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Initialisation des models
const User = require("./models/User");

app.get("/", function(req, res) {
  res.send("Welcome to the leboncoin API.");
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
app.use(userRoutes);
app.use(offerRoutes);

/*
Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront
une erreur 404
*/
app.all("*", function(req, res) {
  res.status(404).json({ error: "Not Found" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("leboncoin API running"); // on port 3000
});

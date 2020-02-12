const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const Offer = require("../models/Offer");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    const obj = {
      title: req.fields.title,
      description: req.fields.description,
      price: req.fields.price,
      creator: req.user
    };
    const offer = new Offer(obj);
    await offer.save();

    res.json({
      _id: offer._id,
      title: offer.title,
      description: offer.description,
      price: offer.price,
      created: offer.created,
      creator: {
        account: offer.creator.account,
        _id: offer.creator._id
      }
    });
  } catch (error) {
    res.json({ message: error.message });
  }
});

const createFilters = req => {
  const filters = {};
  if (req.query.priceMin) {
    filters.price = {};
    filters.price.$gte = req.query.priceMin;
  }
  if (req.query.priceMax) {
    if (filters.price === undefined) {
      filters.price = {};
    }
    filters.price.$lte = req.query.priceMax;
  }

  if (req.query.title) {
    filters.title = new RegExp(req.query.title, "i");
  }
  return filters;
};
router.get("/offer/with-count", async (req, res) => {
  const filters = createFilters(req);

  const search = Offer.find(filters).populate("creator", "account");
  if (req.query.sort === "price-asc") {
    search.sort({ price: 1 });
  } else if (req.query.sort === "price-desc") {
    search.sort({ price: -1 });
  }

  if (req.query.page) {
    const page = req.query.page;
    const limit = 4;
    search.limit(limit).skip(limit * (page - 1));
  }

  const ads = await search;
  res.json(ads);
});

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById({ _id: req.params.id }).populate(
      "creator",
      "account"
    );

    res.json(offer);
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;

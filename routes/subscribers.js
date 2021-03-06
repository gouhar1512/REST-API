const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");
const { restart } = require("nodemon");

// Getting all subscribers
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Getting one
router.get("/:id", getSubscriber, async (req, res) => {
  res.send(res.subscriber);
});

// Creating One
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// Updating One
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribedToChannel) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }

  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.json({ msg: err.message });
  }
});

// Deleting One
router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ msg: "Subscriber removed" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Deleting all
router.delete("/", async (req, res) => {
  try {
    await Subscriber.deleteMany({});
    res.status(200).json({ msg: "All subscribers deleted" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

//middleware to find subscriber by id
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ msg: "Cannot find subscriber" });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
  res.subscriber = subscriber;
  next();
}

module.exports = router;

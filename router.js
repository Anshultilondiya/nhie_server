const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Sever is up and running");
});

module.exports = router;

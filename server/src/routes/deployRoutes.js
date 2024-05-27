const express = require("express");
const { deployApp } = require("../controllers/deployController");
const router = express.Router();

router.post("/", deployApp);

module.exports = router;

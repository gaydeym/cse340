// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");

// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Deliver register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;
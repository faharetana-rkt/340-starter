const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')

// Login Route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Register an account
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router
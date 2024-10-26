const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

// Login Route
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration Route
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Register an account
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

module.exports = router
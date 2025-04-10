// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver register view
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Route to build account management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManagement)
);

// Route to build update account view
router.get(
    "/update/:account_id",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccountView)
);

// Update account information
router.post(
    "/update-user-info/",
    utilities.checkLogin,
    regValidate.updateRegistrationRules(),
    regValidate.checkUpdateRegData,
    utilities.handleErrors(accountController.updateAccountInfo)
);

// Change password
router.post(
    "/update-user-password/",
    utilities.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
);

// Route to build Logout view
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
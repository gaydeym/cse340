// Needed Resources
const express = require('express')
const router = new express.Router()
const utilities = require('../utilities/')
const revController = require('../controllers/reviewController')
const regValidate = require('../utilities/review-validation')

// Route to handle add customer review
router.post(
    '/add-review/',
    utilities.checkLogin,
    regValidate.reviewRules(),
    regValidate.checkAddReviewData,
    utilities.handleErrors(revController.addCustomerReview)
)

// Route to build edit review view
router.get('/edit-review/:reviewId', utilities.checkLogin, utilities.handleErrors(revController.updateReviewView))

// Route to handle edit review view
router.post(
    '/update-review/',
    regValidate.reviewRules(),
    regValidate.checkReviewData,
    utilities.handleErrors(revController.updateReview)
)

// Route to build delete review view
router.get('/delete-review/:reviewId', utilities.checkLogin, utilities.handleErrors(revController.deleteReviewView))

// Route to handle edit review view
router.post('/delete-review/', utilities.handleErrors(revController.deleteReview))

module.exports = router

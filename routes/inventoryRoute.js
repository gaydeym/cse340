// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const regValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get(
    "/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by inventory view
router.get(
    "/detail/:inventoryId",
    utilities.handleErrors(invController.buildByInventoryId)
);

// Route to build inventory management view
router.get('/', utilities.checkAccountType, utilities.handleErrors(invController.buildByInvManagement));

// Route to build add classification view
router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildByAddClassification)
);

// Route to handle add classification
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildByAddInventory)
);

// Route to handle add inventory
router.post(
    "/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to build get inventory view
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view
router.get(
    "/edit/:inventoryId",
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildByEditInventory)
);

// Route to handle update inventory
router.post(
    "/update/",
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.updateInventory)
);

// Route to build delete inventory view
router.get(
    "/delete/:inventoryId",
    utilities.handleErrors(invController.buildByDeleteInventory)
);

// Route to handle delete inventory
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

// Add the new error route
router.get(
    "/trigger-error",
    utilities.handleErrors(invController.triggerError)
);

module.exports = router;

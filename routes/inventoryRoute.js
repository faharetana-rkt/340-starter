// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the detail view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Route to intentional error
router.get("/err", utilities.handleErrors(invController.forcedError));

// Route to Management
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/addclass", utilities.handleErrors(invController.buildAddClassification));

// Route to process add new classificaiton
router.post("/addclass", 
    classValidate.classificationRules(), 
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClassification));

module.exports = router;
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
router.get("/", utilities.authorizeAdminOrEmployee, utilities.handleErrors(invController.buildManagement));

// Route to build add classification view
router.get("/addclass", utilities.authorizeAdminOrEmployee, utilities.handleErrors(invController.buildAddClassification));

// Route to process add new classificaiton
router.post("/addclass", 
    utilities.authorizeAdminOrEmployee,
    classValidate.classificationRules(), 
    classValidate.checkClassData,
    utilities.handleErrors(invController.addClassification));

// Route to build add inventory view
router.get("/addinv", utilities.authorizeAdminOrEmployee, utilities.handleErrors(invController.buildAddInventory));

//Route to process add new inventory or vehicle
router.post("/addinv",
    utilities.authorizeAdminOrEmployee,
    classValidate.inventoryRules(),
    classValidate.checkInvData,
    utilities.handleErrors(invController.addInventory));

// New Route for list of vehicle
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// New Route for editing vehicle
router.get("/edit/:inv_id", utilities.authorizeAdminOrEmployee, utilities.handleErrors(invController.buildEditInventory))

// Route for processing the update
router.post("/edit/", 
    utilities.authorizeAdminOrEmployee,
    classValidate.inventoryRules,
    classValidate.checkEditData,
    utilities.handleErrors(invController.editInventory))

// Delete route
router.get("/delete/:inv_id", utilities.authorizeAdminOrEmployee, utilities.handleErrors(invController.deleteView))

// Route for processing the deletion
router.post("/delete", utilities.authorizeAdminOrEmployee, utilities.handleErrors(invController.deleteItem))

module.exports = router;
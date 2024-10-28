const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
    return [
        // classification name is required and must be a string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:1 })
            .matches(/^[A-Za-z]+$/)
            .withMessage("Please provide a classification name without space, numbers or characters."), //on error this message is sent
    ]
}

/* ******************************
 * Check data and return errors or continue add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}


/*  **********************************
  *  Add Classification Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        // make is required and must be a string min 3 characters without space
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:3 })
            .matches(/^[A-Za-z]+$/)
            .withMessage("Please provide a make without space, numbers or characters."), //on error this message is sent
        
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:3 })
            .matches(/^[A-Za-z]+$/)
            .withMessage("Please provide a model without space, numbers or characters."), //on error this message is sent

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:5 })
            .matches(/^.+$/)
            .withMessage("Please provide a description of 5 characters minimum."), //on error this message is sent

        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\/images\/vehicles\/[a-zA-Z0-9-_]+\.(png|jpg|jpeg)$/)
            .withMessage("The file path must begin with /images/vehicles."), //on error this message is sent

        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .matches(/^\/images\/vehicles\/[a-zA-Z0-9-_]+\.(png|jpg|jpeg)$/)
            .withMessage("The file path must begin with /images/vehicles."), //on error this message is sent
        
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:4 })
            .matches(/^\d+$/)
            .withMessage("The year must be four digits."), //on error this message is sent
        
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:2 })
            .matches(/^\d+(\.\d+)?$/)
            .withMessage("Please provide a price with min 2 numbers or decimals."), //on error this message is sent
        
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:2 })
            .matches(/^\d+$/)
            .withMessage("Please provide mileage with minimum 2 numbers, only numbers."), //on error this message is sent
    ]
}

/* ******************************
 * Check data and return errors or continue to add-inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
        })
        return
    }
    next()
}

module.exports = validate
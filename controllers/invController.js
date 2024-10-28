const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build detail view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicleId = req.params.vehicleId
  const data = await invModel.getInventoryByVehicleId(vehicleId)
  const detail = await utilities.getDetail(data[0])
  let nav = await utilities.getNav()
  const year = data[0].inv_year
  const model = data[0].inv_model
  const make = data[0].inv_make
  res.render("./inventory/detail", {
    title: year + ' ' + make + ' ' + model,
    nav,
    detail,
    errors: null,
  })
}


/* ***************************
 *  Forced Error
 * ************************** */
invCont.forcedError = async function (req, res, next) {
  const data = invModel.getInventoryByVehicleId(vehicleId)
  return data
}

/* ***************************
 *  Build Management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  try {
    const regResult = await invModel.addClassification(classification_name);
  
    if (regResult && regResult.rowCount) {
        nav = await utilities.getNav()
        req.flash("notice", `Congratulations, classification ${classification_name} successfully added.`);
        res.status(201).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the registration of the new classification failed.");
        res.status(500).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        });
    }
  } catch (error) {
    console.error("Registration error:", error); // This logs to your server console
    req.flash("notice", "An error occurred during registration.");
    res.status(500).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
    });
  }
}

/* ***************************
 *  Build Add Inventory View
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let selectClassification = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    selectClassification,
    errors: null,
  })
}


/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let selectClassification = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  try {
    const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
  
    if (regResult && regResult.rowCount) {
        req.flash("notice", `Congratulations, vehicle ${inv_make} ${inv_model} successfully added.`);
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the registration of the new vehicle failed.");
        res.status(500).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            selectClassification,
            errors: null,
        });
    }
  } catch (error) {
    console.error("Registration error:", error); // This logs to your server console
    console.error("Stack trace:", err.stack);
    req.flash("notice", "An error occurred during registration of the vehicle.");
    res.status(500).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        selectClassification,
        errors: null,
    });
  }
}


module.exports = invCont



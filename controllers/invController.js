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
  const selectClassification = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    selectClassification: selectClassification,
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
    const exists = await invModel.checkExistingClass(classification_name);
    if (exists) {
      req.flash("notice", `Classification "${classification_name}" already exists.`);
      return res.status(400).render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
      });
    }

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
    selectClassification: selectClassification,
    errors: null,
  })
}


/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let selectClassification = await utilities.buildClassificationList();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  try {
    const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
  
    if (regResult && regResult.rowCount) {
        req.flash("notice", `Congratulations, vehicle ${inv_make} ${inv_model} successfully added.`);
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            selectClassification: selectClassification,
            errors: null,
        });
    } else {
        req.flash("notice", "Sorry, the registration of the new vehicle failed.");
        selectClassification = await utilities.buildClassificationList()
        res.status(500).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            selectClassification: selectClassification,
            errors: null,
        });
    }
  } catch (error) {
    console.error("Registration error:", error); // This logs to your server console
    console.error("Stack trace:", err.stack);
    req.flash("notice", "An error occurred during registration of the vehicle.");
    let selectClassification = await utilities.buildClassificationList()
    res.status(500).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        selectClassification: selectClassification,
        errors: null,
    });
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 * Build Edit Inventory
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const vehicleDataArray = await invModel.getInventoryByVehicleId(inv_id)
  const vehicleData = vehicleDataArray[0]
  console.log(vehicleData)
  let selectClassification = await utilities.buildClassificationList(vehicleData.classification_id)
  console.log(selectClassification)
  const name = `${vehicleData.inv_make} ${vehicleData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: `Edit ${name}`,
    nav,
    selectClassification: selectClassification,
    errors: null,
    inv_id: vehicleData.inv_id,
    inv_make: vehicleData.inv_make,
    inv_model: vehicleData.inv_model,
    inv_year: vehicleData.inv_year,
    inv_description: vehicleData.inv_description,
    inv_image: vehicleData.inv_image,
    inv_thumbnail: vehicleData.inv_thumbnail,
    inv_price: vehicleData.inv_price,
    inv_miles: vehicleData.inv_miles,
    inv_color: vehicleData.inv_color,
    classification_id: vehicleData.classification_id
  })
}

/* ***************************
 *  Edit Inventory Data
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.editInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const selectClassification = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    selectClassification: selectClassification,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Delete View
 * ************************** */
invCont.deleteView = async function(req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemDataArray = await invModel.getInventoryByVehicleId(inv_id)
  const itemData = itemDataArray[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if(deleteResult) {
    req.flash("notice", 'The deletion was successful.')
    res.redirect('/inv/')
  } else {
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect("/inv/delete/inv_id")
  }
}

module.exports = invCont



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
  })
}

module.exports = invCont

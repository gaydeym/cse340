const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build a single listing element view HTML
* ************************************ */
Util.buildItemListing = async function(data) {
  let listing = '';
  console.dir({data});
  if(data) {
    listing = `
      <section class="car-listing">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
        <div class="car-information">
          <div>
            <h2>${data.inv_make} ${data.inv_model} Details</h2>
          </div>
          <div class="description">
            <p class="price bold">
              Price: ${Number.parseFloat(data.inv_price).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0})}
            </p>
            <p>
              <span class="bold">Description: </span>${data.inv_description}
            </p>
            <p>
              <span class="bold">Color: </span>${data.inv_color}
            </p>
            <p>
              <span class="bold">Miles: </span>${data.inv_miles.toLocaleString('en-US', { style: 'decimal'})}
            </p>
          </div>
        </div>
      </section>
    `;
  } else {
    listing = `
      <p>Sorry, not matching vehicles could be found.</p>
    `
  }
  return listing;
}

/* ************************
 * Constructs the Classification HTML select dropdown
 ************************** */
Util.buildClassificationDropdown = async function (classification_id) {
    let data = await invModel.getClassifications();

    let option = `<select id="classification_id" name="classification_id" value="<%= locals.classification_id %>" required><option value="" disabled selected>Select a classification</option>`;

    data.rows.forEach((row) => {
        const isSelected = classification_id === row.classification_id ? "selected" : "";
        option += `<option value="${row.classification_id}" ${isSelected}>${row.classification_name}</option>`;
    });

    option += `</select>`;

    return option;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
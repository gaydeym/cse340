const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
        list += "</li>";
    });
    list += "</ul>";
    return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach((vehicle) => {
            grid += "<li>";
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                'details"><img src="' +
                vehicle.inv_thumbnail +
                '" alt="Image of ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' on CSE Motors" /></a>';
            grid += '<div class="namePrice">';
            grid += "<hr />";
            grid += "<h2>";
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' details">' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                "</a>";
            grid += "</h2>";
            grid +=
                "<span>$" +
                new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
                "</span>";
            grid += "</div>";
            grid += "</li>";
        });
        grid += "</ul>";
    } else {
        grid +=
            '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

/* **************************************
 * Build a single listing element view HTML
 * ************************************ */
Util.buildItemListing = async function (data) {
    let listing = "";
    console.dir({ data });
    if (data) {
        listing = `
      <section class="car-listing">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
        <div class="car-information">
          <div>
            <h2>${data.inv_make} ${data.inv_model} Details</h2>
          </div>
          <div class="description">
            <p class="price bold">
              Price: ${Number.parseFloat(data.inv_price).toLocaleString(
                  "en-US",
                  {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                  }
              )}
            </p>
            <p>
              <span class="bold">Description: </span>${data.inv_description}
            </p>
            <p>
              <span class="bold">Color: </span>${data.inv_color}
            </p>
            <p>
              <span class="bold">Miles: </span>${data.inv_miles.toLocaleString(
                  "en-US",
                  { style: "decimal" }
              )}
            </p>
          </div>
        </div>
      </section>
    `;
    } else {
        listing = `
      <p>Sorry, not matching vehicles could be found.</p>
    `;
    }
    return listing;
};

/* ************************
 * Constructs the Classification HTML select dropdown
 ************************** */
Util.buildClassificationDropdown = async function (classification_id = "") {
    let data = await invModel.getClassifications();

    let option = `<select id="classification_id" name="classification_id" required><option value="" disabled ${!classification_id ? "selected" : ""}>Select a classification</option>`;
    data.rows.forEach((row) => {
        const isSelected = classification_id.toString() === row.classification_id.toString()? "selected": "";
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
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function (err, accountData) {
                if (err) {
                    req.flash("Please log in");
                    res.clearCookie("jwt");
                    return res.redirect("/account/login");
                }
                res.locals.accountData = accountData;
                res.locals.loggedin = 1;
                next();
            }
        );
    } else {
        next();
    }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
      next();
  } else {
      req.flash("notice", "Please log in.");
      return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware to check account type for access
 **************************************** */
Util.checkAccountType = (req, res, next) => {
    const redirectToLogin = (message) => {
        req.flash("notice", message);
        return res.redirect("/account/login");
    };

    const verifyToken = (token) => {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET,
                (err, accountData) => {
                    if (err) return reject(err);
                    resolve(accountData);
                }
            );
        });
    };

    if (!req.cookies.jwt) {
        return redirectToLogin(
            "You are not logged in. Please log in to access this page."
        );
    }

    verifyToken(req.cookies.jwt)
        .then((accountData) => {
            const { account_type, account_firstname } = accountData;

            if (account_type === "Admin" || account_type === "Employee") {
                req.flash(
                    "success",
                    `Welcome back, ${account_firstname}! You are successfully logged in as an ${account_type}.`
                );
                res.locals.accountData = accountData;
                res.locals.loggedin = true;
                return next();
            }

            if (account_type === "Client") {
                return redirectToLogin(
                    `Sorry, ${account_firstname}. You must be logged in as an Employee or Admin to access this page.`
                );
            }

            return redirectToLogin(
                "Your account type is not authorized to access this page. Please contact support."
            );
        })
        .catch((err) => {
            console.error("JWT verification error:", err);
            return redirectToLogin(
                "Your session has expired or is invalid. Please log in again."
            );
        });
};

module.exports = Util;

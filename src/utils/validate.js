"use strict";

/**
 * Validate user input
 *
 * @param {String} userInput
 * @returns {Boolean}
 */

const validateInput = (userInput) => {
  if (!userInput) {
    console.log("This field is required!");
    return false;
  }
  return true;
};

module.exports = validateInput;

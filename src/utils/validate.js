'use strict';

/**
 * Validate user input
 *
 * @param {String} userInput
 * @returns {Boolean}
 */

const validateInput = userInput => {
  if (!userInput) {
    console.log('This field is required!');
    return false;
  } else {
    return true;
  }
};

module.exports = validateInput;

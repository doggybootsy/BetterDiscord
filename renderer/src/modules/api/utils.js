import Utilities from "../utilities";

/**
 * `Utils` is a utility class for interacting with React internals. Instance is accessible through the {@link BdApi}.
 * This is extremely useful for interacting with the internals of the UI.
 * @type Utils
 * @summary {@link Utils} is a utility class for interacting with React internals.
 * @memberof BdApi
 * @name Utils
 */
const Utils = {
    /**
     * Wraps a given function in a `try..catch` block.
     * 
     * @deprecated
     * @param {function} method Function to wrap
     * @param {string} message Additional messasge to print when an error occurs
     * @returns {function} The new wrapped function
     */
    suppressErrors(method, message) {
        return Utilities.suppressErrors(method, message);
    },

    /**
     * Tests a given object to determine if it is valid JSON.
     * 
     * @deprecated
     * @param {object} data Data to be tested
     * @returns {boolean} Result of the test
     */
    testJSON(data) {
        return Utilities.testJSON(data);
    }
};

Object.freeze(Utils);

export default Utils;
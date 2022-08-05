import Utilities from "../utilities";

/**
 * `ReactUtils` is a utility class for interacting with React internals. Instance is accessible through the {@link BdApi}.
 * This is extremely useful for interacting with the internals of the UI.
 * @type ReactUtils
 * @summary {@link ReactUtils} is a utility class for interacting with React internals.
 * @memberof BdApi
 * @name ReactUtils
 */
const ReactUtils = {
    /**
     * Get the internal react data of a specified node
     * 
     * @param {HTMLElement} node Node to get the react data from
     * @returns {object|undefined} Either the found data or `undefined` 
     */
    getInternalInstance(node) {
        return Utilities.getReactInstance(node);
    }

};

Object.freeze(ReactUtils);

export default ReactUtils;
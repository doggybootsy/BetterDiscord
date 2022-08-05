import DOMManager from "../dommanager";
import Utilities from "../utilities";

/**
 * `DOM` is a simple utility class for dom manipulation. An instance is available on {@link BdApi}.
 * @type DOM
 * @summary {@link DOM} is a simple utility class for dom manipulation.
 * @name DOM
 */
class DOM {

    constructor(callerName) {
        if (!callerName) return;
        this.addStyle = this.addStyle.bind(this, callerName);
        this.removeStyle = this.removeStyle.bind(this, callerName);
    }

    /**
     * Adds a `<style>` to the document with the given ID.
     * 
     * @param {string} id ID to use for style element
     * @param {string} css CSS to apply to the document
     */
    addStyle(id, css) {
        if (arguments.length === 3) {
            id = arguments[1];
            css = arguments[2];
        }

        DOMManager.injectStyle(id, css);
    }

    /**
     * Removes a `<style>` from the document corresponding to the given ID.
     * 
     * @param {string} id ID uses for the style element
     */
    removeStyle(id) {
        if (arguments.length === 2) id = arguments[1];
        DOMManager.removeStyle(id);
    }

    /**
     * Adds a listener for when the node is removed from the document body.
     * 
     * @param {HTMLElement} node Node to be observed
     * @param {function} callback Function to run when fired
     */
    onRemoved(node, callback) {
        Utilities.onRemoved(node, callback);
    }

}

Object.freeze(DOM);
Object.freeze(DOM.prototype);

export default DOM;
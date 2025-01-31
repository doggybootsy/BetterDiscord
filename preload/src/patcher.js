import {webFrame} from "electron";

/* global window:false */

function pollyFillDefault(module) {
    if ("default" in module.exports) return;

    function ensureProperty(key, value) {
        if (key in module.exports) return;
        
        Object.defineProperty(module.exports, key, {value});
    }

    if ("Z" in module.exports || "ZP" in module.exports) {
        Object.defineProperty(module.exports, "default", {
            get: () => module.exports.Z || module.exports.ZP,
            set: (v) => {
                if ("Z" in module.exports) module.exports.Z = v;
                if ("ZP" in module.exports) module.exports.ZP = v;
            }
        });

        ensureProperty("__esModule", true);
        ensureProperty(Symbol.toStringTag, "Module");
    }
  }

export default function () {
    const patcher = function () {
        const chunkName = "webpackChunkdiscord_app";
        const predefine = function (target, prop, effect) {
            const value = target[prop];
            Object.defineProperty(target, prop, {
                get() {return value;},
                set(newValue) {
                    Object.defineProperty(target, prop, {
                        value: newValue,
                        configurable: true,
                        enumerable: true,
                        writable: true
                    });

                    try {
                        effect(newValue);
                    }
                    catch (error) {
                        // eslint-disable-next-line no-console
                        console.error(error);
                    }

                    // eslint-disable-next-line no-setter-return
                    return newValue;
                },
                configurable: true
            });
        };
        
        if (!Reflect.has(window, chunkName)) {
            predefine(window, chunkName, instance => {
                instance.push([[Symbol()], {}, require => {
                    require.d = (target, exports) => {
                        for (const key in exports) {
                            if (!Reflect.has(exports, key)) continue;

                            try {
                                Object.defineProperty(target, key, {
                                    get: () => exports[key](),
                                    set: v => {exports[key] = () => v;},
                                    enumerable: true,
                                    configurable: true
                                });
                            }
                            catch (error) {
                                // eslint-disable-next-line no-console
                                console.error(error);
                            }
                        }
                    };

                    require.c = new Proxy(require.c, {
                        get() {
                            const module = Reflect.get(...arguments);

                            if (typeof module?.exports === "object") {
                                pollyFillDefault(module);
                            }

                            return module;
                        }
                    });
                }]);
            });
        }
    };
    
    webFrame.top.executeJavaScript("(" + patcher + ")()");
}

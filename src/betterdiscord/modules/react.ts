import DiscordModules from "./discordmodules";
/** @type {import("react")} */
const React = DiscordModules.React;
export default React;
export const ReactDOM = DiscordModules.ReactDOM;

// To get all keys use
// copy(Object.keys(BdApi.React).filter(m => !(m.startsWith("__") || m.startsWith("unstable_"))).join(", "));
const {Children, Component, Fragment, Profiler, PureComponent, StrictMode, Suspense, act, cache, cloneElement, createContext, createElement, createRef, forwardRef, isValidElement, lazy, memo, startTransition, use, useActionState, useCallback, useContext, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useOptimistic, useReducer, useRef, useState, useSyncExternalStore, useTransition, version} = React;
export {Children, Component, Fragment, Profiler, PureComponent, StrictMode, Suspense, act, cache, cloneElement, createContext, createElement, createRef, forwardRef, isValidElement, lazy, memo, startTransition, use, useActionState, useCallback, useContext, useDebugValue, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useLayoutEffect, useMemo, useOptimistic, useReducer, useRef, useState, useSyncExternalStore, useTransition, version}; // Re-export these for lucide
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/@lit/reactive-element/development/css-tag.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/css-tag.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* binding */ supportsAdoptingStyleSheets),
/* harmony export */   "CSSResult": () => (/* binding */ CSSResult),
/* harmony export */   "unsafeCSS": () => (/* binding */ unsafeCSS),
/* harmony export */   "css": () => (/* binding */ css),
/* harmony export */   "adoptStyles": () => (/* binding */ adoptStyles),
/* harmony export */   "getCompatibleStyle": () => (/* binding */ getCompatibleStyle)
/* harmony export */ });
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = window.ShadowRoot &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        // Note, if `supportsAdoptingStyleSheets` is true then we assume
        // CSSStyleSheet is constructable.
        if (supportsAdoptingStyleSheets && this._styleSheet === undefined) {
            this._styleSheet = new CSSStyleSheet();
            this._styleSheet.replaceSync(this.cssText);
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const cssResultCache = new Map();
const getCSSResult = (cssText) => {
    let result = cssResultCache.get(cssText);
    if (result === undefined) {
        cssResultCache.set(cssText, (result = new CSSResult(cssText, constructionToken)));
    }
    return result;
};
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ` +
            `${value}. Use 'unsafeCSS' to pass non-literal values, but take care ` +
            `to ensure page security.`);
    }
};
/**
 * Wrap a value for interpolation in a [[`css`]] tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return getCSSResult(typeof value === 'string' ? value : String(value));
};
/**
 * Template tag which which can be used with LitElement's [[LitElement.styles |
 * `styles`]] property to set element styles. For security reasons, only literal
 * string values may be used. To incorporate non-literal values [[`unsafeCSS`]]
 * may be used inside a template string part.
 */
const css = (strings, ...values) => {
    const cssText = strings.length === 1
        ? strings[0]
        : values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return getCSSResult(cssText);
};
/**
 * Applies the given styles to a `shadowRoot`. When Shadow DOM is
 * available but `adoptedStyleSheets` is not, styles are appended to the
 * `shadowRoot` to [mimic spec behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
 * Note, when shimming is used, any styles that are subsequently placed into
 * the shadowRoot should be placed *before* any shimmed adopted styles. This
 * will match spec behavior that gives adopted sheets precedence over styles in
 * shadowRoot.
 */
const adoptStyles = (renderRoot, styles) => {
    if (supportsAdoptingStyleSheets) {
        renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    }
    else {
        styles.forEach((s) => {
            const style = document.createElement('style');
            style.textContent = s.cssText;
            renderRoot.appendChild(style);
        });
    }
};
const cssResultFromStyleSheet = (sheet) => {
    let cssText = '';
    for (const rule of sheet.cssRules) {
        cssText += rule.cssText;
    }
    return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets
    ? (s) => s
    : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;
//# sourceMappingURL=css-tag.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/base.js":
/*!*******************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/base.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "legacyPrototypeMethod": () => (/* binding */ legacyPrototypeMethod),
/* harmony export */   "standardPrototypeMethod": () => (/* binding */ standardPrototypeMethod),
/* harmony export */   "decorateProperty": () => (/* binding */ decorateProperty)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const legacyPrototypeMethod = (descriptor, proto, name) => {
    Object.defineProperty(proto, name, descriptor);
};
const standardPrototypeMethod = (descriptor, element) => ({
    kind: 'method',
    placement: 'prototype',
    key: element.key,
    descriptor,
});
/**
 * Helper for decorating a property that is compatible with both TypeScript
 * and Babel decorators. The optional `finisher` can be used to perform work on
 * the class. The optional `descriptor` should return a PropertyDescriptor
 * to install for the given property.
 *
 * @param finisher {function} Optional finisher method; receives the element
 * constructor and property key as arguments and has no return value.
 * @param descriptor {function} Optional descriptor method; receives the
 * property key as an argument and returns a property descriptor to define for
 * the given property.
 * @returns {ClassElement|void}
 */
const decorateProperty = ({ finisher, descriptor, }) => (protoOrDescriptor, name
// Note TypeScript requires the return type to be `void|any`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
    var _a;
    // TypeScript / Babel legacy mode
    if (name !== undefined) {
        const ctor = protoOrDescriptor
            .constructor;
        if (descriptor !== undefined) {
            Object.defineProperty(protoOrDescriptor, name, descriptor(name));
        }
        finisher === null || finisher === void 0 ? void 0 : finisher(ctor, name);
        // Babel standard mode
    }
    else {
        // Note, the @property decorator saves `key` as `originalKey`
        // so try to use it here.
        const key = (_a = 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        protoOrDescriptor.originalKey) !== null && _a !== void 0 ? _a : protoOrDescriptor.key;
        const info = descriptor != undefined
            ? {
                kind: 'method',
                placement: 'prototype',
                key,
                descriptor: descriptor(protoOrDescriptor.key),
            }
            : { ...protoOrDescriptor, key };
        if (finisher != undefined) {
            info.finisher = function (ctor) {
                finisher(ctor, key);
            };
        }
        return info;
    }
};
//# sourceMappingURL=base.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/custom-element.js":
/*!*****************************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/custom-element.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* binding */ customElement)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        },
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement extends LitElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The tag name of the custom element to define.
 */
const customElement = (tagName) => (classOrDescriptor) => typeof classOrDescriptor === 'function'
    ? legacyCustomElement(tagName, classOrDescriptor)
    : standardCustomElement(tagName, classOrDescriptor);
//# sourceMappingURL=custom-element.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/event-options.js":
/*!****************************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/event-options.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eventOptions": () => (/* binding */ eventOptions)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "../../node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}`>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
function eventOptions(options) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        finisher: (ctor, name) => {
            Object.assign(ctor.prototype[name], options);
        },
    });
}
//# sourceMappingURL=event-options.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/property.js":
/*!***********************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/property.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "property": () => (/* binding */ property)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' &&
        element.descriptor &&
        !('value' in element.descriptor)) {
        return {
            ...element,
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            },
        };
    }
    else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // store the original key so subsequent decorators have access to it.
            originalKey: element.key,
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            },
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a reactive property that reflects a
 * corresponding attribute value. When a decorated property is set
 * the element will update and render. A [[`PropertyDeclaration`]] may
 * optionally be supplied to configure property features.
 *
 * This decorator should only be used for public fields. As public fields,
 * properties should be considered as primarily settable by element users,
 * either via attribute or the property itself.
 *
 * Generally, properties that are changed by the element should be private or
 * protected fields and should use the [[`state`]] decorator.
 *
 * However, sometimes element code does need to set a public property. This
 * should typically only be done in response to user interaction, and an event
 * should be fired informing the user; for example, a checkbox sets its
 * `checked` property when clicked and fires a `changed` event. Mutating public
 * properties should typically not be done for non-primitive (object or array)
 * properties. In other cases when an element needs to manage state, a private
 * property decorated via the [[`state`]] decorator should be used. When needed,
 * state properties can be initialized via public properties to facilitate
 * complex interactions.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function property(options) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (protoOrDescriptor, name) => name !== undefined
        ? legacyProperty(options, protoOrDescriptor, name)
        : standardProperty(options, protoOrDescriptor);
}
//# sourceMappingURL=property.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/query-all.js":
/*!************************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/query-all.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAll": () => (/* binding */ queryAll)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "../../node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See:
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
 *
 * @example
 * ```ts
 * class MyElement {
 *   @queryAll('div')
 *   divs;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAll(selector) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            get() {
                var _a;
                return (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector);
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-all.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js":
/*!***********************************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAssignedNodes": () => (/* binding */ queryAssignedNodes)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "../../node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// TODO(sorvell): Remove when https://github.com/webcomponents/polyfills/issues/397 is addressed.
// x-browser support for matches
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ElementProto = Element.prototype;
const legacyMatches = ElementProto.msMatchesSelector || ElementProto.webkitMatchesSelector;
/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 *
 * @param slotName A string name of the slot.
 * @param flatten A boolean which when true flattens the assigned nodes,
 *     meaning any assigned nodes that are slot elements are replaced with their
 *     assigned nodes.
 * @param selector A string which filters the results to elements that match
 *     the given css selector.
 *
 * * @example
 * ```ts
 * class MyElement {
 *   @queryAssignedNodes('list', true, '.item')
 *   listItems;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAssignedNodes(slotName = '', flatten = false, selector = '') {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            get() {
                var _a, _b;
                const slotSelector = `slot${slotName ? `[name=${slotName}]` : ':not([name])'}`;
                const slot = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(slotSelector);
                let nodes = (_b = slot) === null || _b === void 0 ? void 0 : _b.assignedNodes({ flatten });
                if (nodes && selector) {
                    nodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE &&
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (node.matches
                            ? node.matches(selector)
                            : legacyMatches.call(node, selector)));
                }
                return nodes;
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-assigned-nodes.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/query-async.js":
/*!**************************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/query-async.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "queryAsync": () => (/* binding */ queryAsync)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "../../node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
function queryAsync(selector) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (_name) => ({
            async get() {
                var _a;
                await this.updateComplete;
                return (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        }),
    });
}
//# sourceMappingURL=query-async.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/query.js":
/*!********************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/query.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "query": () => (/* binding */ query)
/* harmony export */ });
/* harmony import */ var _base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.js */ "../../node_modules/@lit/reactive-element/development/decorators/base.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 *     once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function query(selector, cache) {
    return (0,_base_js__WEBPACK_IMPORTED_MODULE_0__.decorateProperty)({
        descriptor: (name) => {
            const descriptor = {
                get() {
                    var _a;
                    return (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
                },
                enumerable: true,
                configurable: true,
            };
            if (cache) {
                const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
                descriptor.get = function () {
                    var _a;
                    if (this[key] === undefined) {
                        this[key] = (_a = this.renderRoot) === null || _a === void 0 ? void 0 : _a.querySelector(selector);
                    }
                    return this[key];
                };
            }
            return descriptor;
        },
    });
}
//# sourceMappingURL=query.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/decorators/state.js":
/*!********************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/decorators/state.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "state": () => (/* binding */ state)
/* harmony export */ });
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./property.js */ "../../node_modules/@lit/reactive-element/development/decorators/property.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/*
 * IMPORTANT: For compatibility with tsickle and the Closure JS compiler, all
 * property decorators (but not class decorators) in this file that have
 * an @ExportDecoratedItems annotation must be defined as a regular function,
 * not an arrow function.
 */

/**
 * Declares a private or protected reactive property that still triggers
 * updates to the element when it changes. It does not reflect from the
 * corresponding attribute.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 * @category Decorator
 */
function state(options) {
    return (0,_property_js__WEBPACK_IMPORTED_MODULE_0__.property)({
        ...options,
        state: true,
        attribute: false,
    });
}
//# sourceMappingURL=state.js.map

/***/ }),

/***/ "../../node_modules/@lit/reactive-element/development/reactive-element.js":
/*!********************************************************************************!*\
  !*** ../../node_modules/@lit/reactive-element/development/reactive-element.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ _css_tag_js__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS),
/* harmony export */   "defaultConverter": () => (/* binding */ defaultConverter),
/* harmony export */   "notEqual": () => (/* binding */ notEqual),
/* harmony export */   "ReactiveElement": () => (/* binding */ ReactiveElement)
/* harmony export */ });
/* harmony import */ var _css_tag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css-tag.js */ "../../node_modules/@lit/reactive-element/development/css-tag.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c, _d;
var _e;
var _f;
/**
 * Use this module if you want to create your own base class extending
 * [[ReactiveElement]].
 * @packageDocumentation
 */


const DEV_MODE = true;
let requestUpdateThenable;
if (DEV_MODE) {
    // TODO(sorvell): Add a link to the docs about using dev v. production mode.
    console.warn(`Running in dev mode. Do not use in production!`);
    // Issue platform support warning.
    if (((_a = window.ShadyDOM) === null || _a === void 0 ? void 0 : _a.inUse) &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globalThis['reactiveElementPlatformSupport'] === undefined) {
        console.warn(`Shadow DOM is being polyfilled via ShadyDOM but ` +
            `the \`polyfill-support\` module has not been loaded.`);
    }
    requestUpdateThenable = {
        then: (onfulfilled, _onrejected) => {
            console.warn(`\`requestUpdate\` no longer returns a Promise.` +
                `Use \`updateComplete\` instead.`);
            if (onfulfilled !== undefined) {
                onfulfilled(false);
            }
        },
    };
}
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
/*@__INLINE__*/
const JSCompiler_renameProperty = (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                value = value ? '' : null;
                break;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                value = value == null ? value : JSON.stringify(value);
                break;
        }
        return value;
    },
    fromAttribute(value, type) {
        let fromValue = value;
        switch (type) {
            case Boolean:
                fromValue = value !== null;
                break;
            case Number:
                fromValue = value === null ? null : Number(value);
                break;
            case Object:
            case Array:
                // Do *not* generate exception when invalid JSON is set as elements
                // don't normally complain on being mis-configured.
                // TODO(sorvell): Do generate exception in *dev mode*.
                try {
                    // Assert to adhere to Bazel's "must type assert JSON parse" rule.
                    fromValue = JSON.parse(value);
                }
                catch (e) {
                    fromValue = null;
                }
                break;
        }
        return fromValue;
    },
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual,
};
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
class ReactiveElement extends HTMLElement {
    constructor() {
        super();
        this.__instanceProperties = new Map();
        this.__pendingConnectionPromise = undefined;
        this.__enableConnection = undefined;
        /**
         * @category updates
         */
        this.isUpdatePending = false;
        /**
         * @category updates
         */
        this.hasUpdated = false;
        /**
         * Name of currently reflecting property
         */
        this.__reflectingProperty = null;
        this._initialize();
    }
    /**
     * @nocollapse
     */
    static addInitializer(initializer) {
        var _a;
        (_a = this._initializers) !== null && _a !== void 0 ? _a : (this._initializers = []);
        this._initializers.push(initializer);
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     * @category attributes
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.elementProperties.forEach((v, p) => {
            const attr = this.__attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     * @category properties
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // if this is a state property, force the attribute to false.
        if (options.state) {
            // Cast as any since this is readonly.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options.attribute = false;
        }
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure finalization has been kicked off.
        this.finalize();
        this.elementProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (!options.noAccessor && !this.prototype.hasOwnProperty(name)) {
            const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                Object.defineProperty(this.prototype, name, descriptor);
            }
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     * @category properties
     */
    static getPropertyDescriptor(name, key, options) {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     * @category properties
     */
    static getPropertyOptions(name) {
        return this.elementProperties.get(name) || defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties, sets up element
     * styling, and ensures any superclasses are also finalized. Returns true if
     * the element was finalized.
     * @nocollapse
     */
    static finalize() {
        if (this.hasOwnProperty(finalized)) {
            return false;
        }
        this[finalized] = true;
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        superCtor.finalize();
        this.elementProperties = new Map(superCtor.elementProperties);
        // initialize Map populated in observedAttributes
        this.__attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...Object.getOwnPropertySymbols(props),
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeScript lack of support for symbol in
                // index types
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.createProperty(p, props[p]);
            }
        }
        this.elementStyles = this.finalizeStyles(this.styles);
        // DEV mode warnings
        if (DEV_MODE) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const warnRemoved = (obj, name) => {
                if (obj[name] !== undefined) {
                    console.warn(`\`${name}\` is implemented. It ` +
                        `has been removed from this version of ReactiveElement.` +
                        ` See the changelog at https://github.com/lit/lit/blob/main/packages/reactive-element/CHANGELOG.md`);
                }
            };
            [`initialize`, `requestUpdateInternal`, `_getUpdateComplete`].forEach((name) => 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            warnRemoved(this.prototype, name));
        }
        return true;
    }
    /**
     * Takes the styles the user supplied via the `static styles` property and
     * returns the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * Styles are deduplicated preserving the _last_ instance in the list. This
     * is a performance optimization to avoid duplicated styles that can occur
     * especially when composing via subclassing. The last item is kept to try
     * to preserve the cascade order with the assumption that it's most important
     * that last added styles override previous styles.
     *
     * @nocollapse
     * @category styles
     */
    static finalizeStyles(styles) {
        const elementStyles = [];
        if (Array.isArray(styles)) {
            // Dedupe the flattened array in reverse order to preserve the last items.
            // TODO(sorvell): casting to Array<unknown> works around TS error that
            // appears to come from trying to flatten a type CSSResultArray.
            const set = new Set(styles.flat(Infinity).reverse());
            // Then preserve original order by adding the set items in reverse order.
            for (const s of set) {
                elementStyles.unshift((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(s));
            }
        }
        else if (styles !== undefined) {
            elementStyles.push((0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle)(styles));
        }
        return elementStyles;
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
                ? attribute
                : typeof name === 'string'
                    ? name.toLowerCase()
                    : undefined;
    }
    /**
     * Internal only override point for customizing work done when elements
     * are constructed.
     *
     * @internal
     */
    _initialize() {
        var _a;
        this.__updatePromise = new Promise((res) => (this.enableUpdating = res));
        this._$changedProperties = new Map();
        this.__saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdate();
        (_a = this.constructor._initializers) === null || _a === void 0 ? void 0 : _a.forEach((i) => i(this));
    }
    /**
     * @category controllers
     */
    addController(controller) {
        var _a, _b;
        ((_a = this.__controllers) !== null && _a !== void 0 ? _a : (this.__controllers = [])).push(controller);
        // If a controller is added after the element has been connected,
        // call hostConnected. Note, re-using existence of `renderRoot` here
        // (which is set in connectedCallback) to avoid the need to track a
        // first connected state.
        if (this.renderRoot !== undefined && this.isConnected) {
            (_b = controller.hostConnected) === null || _b === void 0 ? void 0 : _b.call(controller);
        }
    }
    /**
     * @category controllers
     */
    removeController(controller) {
        var _a;
        // Note, if the indexOf is -1, the >>> will flip the sign which makes the
        // splice do nothing.
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.splice(this.__controllers.indexOf(controller) >>> 0, 1);
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    __saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor.elementProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                this.__instanceProperties.set(p, this[p]);
                delete this[p];
            }
        });
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     *
     * @return Returns a node into which to render.
     * @category rendering
     */
    createRenderRoot() {
        var _a;
        const renderRoot = (_a = this.shadowRoot) !== null && _a !== void 0 ? _a : this.attachShadow(this.constructor.shadowRootOptions);
        (0,_css_tag_js__WEBPACK_IMPORTED_MODULE_0__.adoptStyles)(renderRoot, this.constructor.elementStyles);
        return renderRoot;
    }
    /**
     * On first connection, creates the element's renderRoot, sets up
     * element styling, and enables updating.
     * @category lifecycle
     */
    connectedCallback() {
        var _a;
        // create renderRoot before first update.
        if (this.renderRoot === undefined) {
            this.renderRoot = this.createRenderRoot();
        }
        this.enableUpdating(true);
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostConnected) === null || _a === void 0 ? void 0 : _a.call(c); });
        // If we were disconnected, re-enable updating by resolving the pending
        // connection promise
        if (this.__enableConnection) {
            this.__enableConnection();
            this.__pendingConnectionPromise = this.__enableConnection = undefined;
        }
    }
    /**
     * Note, this method should be considered final and not overridden. It is
     * overridden on the element instance with a function that triggers the first
     * update.
     * @category updates
     */
    enableUpdating(_requestedUpdate) { }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     * @category lifecycle
     */
    disconnectedCallback() {
        var _a;
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostDisconnected) === null || _a === void 0 ? void 0 : _a.call(c); });
        this.__pendingConnectionPromise = new Promise((r) => (this.__enableConnection = r));
    }
    /**
     * Synchronizes property values when attributes change.
     * @category attributes
     */
    attributeChangedCallback(name, _old, value) {
        this._$attributeToProperty(name, value);
    }
    __propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        var _a, _b;
        const attr = this
            .constructor.__attributeNameForProperty(name, options);
        if (attr !== undefined && options.reflect === true) {
            const toAttribute = (_b = (_a = options.converter) === null || _a === void 0 ? void 0 : _a.toAttribute) !== null && _b !== void 0 ? _b : defaultConverter.toAttribute;
            const attrValue = toAttribute(value, options.type);
            if (DEV_MODE &&
                this.constructor.enabledWarnings.indexOf('migration') >= 0 &&
                attrValue === undefined) {
                console.warn(`The attribute value for the ` +
                    `${name} property is undefined. The attribute will be ` +
                    `removed, but in the previous version of ReactiveElement, the ` +
                    `attribute would not have changed.`);
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this.__reflectingProperty = name;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /** @internal */
    _$attributeToProperty(name, value) {
        var _a, _b, _c;
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        const propName = ctor.__attributeToPropertyMap.get(name);
        // Use tracking info to avoid reflecting a property value to an attribute
        // if it was just set because the attribute changed.
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = ctor.getPropertyOptions(propName);
            const converter = options.converter;
            const fromAttribute = (_c = (_b = (_a = converter) === null || _a === void 0 ? void 0 : _a.fromAttribute) !== null && _b !== void 0 ? _b : (typeof converter === 'function'
                ? converter
                : null)) !== null && _c !== void 0 ? _c : defaultConverter.fromAttribute;
            // mark state reflecting
            this.__reflectingProperty = propName;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this[propName] = fromAttribute(value, options.type);
            // mark state not reflecting
            this.__reflectingProperty = null;
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should be called
     * when an element should update based on some state not triggered by setting
     * a reactive property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored.
     *
     * @param name name of requesting property
     * @param oldValue old value of requesting property
     * @param options property options to use instead of the previously
     *     configured options
     * @category updates
     */
    requestUpdate(name, oldValue, options) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            options =
                options ||
                    this.constructor.getPropertyOptions(name);
            const hasChanged = options.hasChanged || notEqual;
            if (hasChanged(this[name], oldValue)) {
                if (!this._$changedProperties.has(name)) {
                    this._$changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true && this.__reflectingProperty !== name) {
                    if (this.__reflectingProperties === undefined) {
                        this.__reflectingProperties = new Map();
                    }
                    this.__reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this.isUpdatePending && shouldRequestUpdate) {
            this.__updatePromise = this.__enqueueUpdate();
        }
        // Note, since this no longer returns a promise, in dev mode we return a
        // thenable which warns if it's called.
        return DEV_MODE ? requestUpdateThenable : undefined;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async __enqueueUpdate() {
        this.isUpdatePending = true;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this.__updatePromise;
            // If we were disconnected, wait until re-connected to flush an update
            while (this.__pendingConnectionPromise) {
                await this.__pendingConnectionPromise;
            }
        }
        catch (e) {
            // Refire any previous errors async so they do not disrupt the update
            // cycle. Errors are refired so developers have a chance to observe
            // them, and this can be done by implementing
            // `window.onunhandledrejection`.
            Promise.reject(e);
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this.isUpdatePending;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     * @category updates
     */
    performUpdate() {
        var _a;
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this.isUpdatePending) {
            return;
        }
        // create renderRoot before first update.
        if (!this.hasUpdated) {
            // Produce warning if any class properties are shadowed by class fields
            if (DEV_MODE) {
                const shadowedProperties = [];
                this.constructor.elementProperties.forEach((_v, p) => {
                    var _a;
                    if (this.hasOwnProperty(p) && !((_a = this.__instanceProperties) === null || _a === void 0 ? void 0 : _a.has(p))) {
                        shadowedProperties.push(p);
                    }
                });
                if (shadowedProperties.length) {
                    // TODO(sorvell): Link to docs explanation of this issue.
                    console.warn(`The following properties will not trigger updates as expected ` +
                        `because they are set using class fields: ` +
                        `${shadowedProperties.join(', ')}. ` +
                        `Native class fields and some compiled output will overwrite ` +
                        `accessors used for detecting changes. To fix this issue, ` +
                        `either initialize properties in the constructor or adjust ` +
                        `your compiler settings; for example, for TypeScript set ` +
                        `\`useDefineForClassFields: false\` in your \`tsconfig.json\`.`);
                }
            }
        }
        // Mixin instance properties once, if they exist.
        if (this.__instanceProperties) {
            // Use forEach so this works even if for/of loops are compiled to for loops
            // expecting arrays
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.__instanceProperties.forEach((v, p) => (this[p] = v));
            this.__instanceProperties = undefined;
        }
        let shouldUpdate = false;
        const changedProperties = this._$changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.willUpdate(changedProperties);
                (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostUpdate) === null || _a === void 0 ? void 0 : _a.call(c); });
                this.update(changedProperties);
            }
            else {
                this.__markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this.__markUpdated();
            throw e;
        }
        // The update is no longer considered pending and further updates are now allowed.
        if (shouldUpdate) {
            this._$didUpdate(changedProperties);
        }
    }
    /**
     * @category updates
     */
    willUpdate(_changedProperties) { }
    // Note, this is an override point for polyfill-support.
    // @internal
    _$didUpdate(changedProperties) {
        var _a;
        (_a = this.__controllers) === null || _a === void 0 ? void 0 : _a.forEach((c) => { var _a; return (_a = c.hostUpdated) === null || _a === void 0 ? void 0 : _a.call(c); });
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
        if (DEV_MODE &&
            this.isUpdatePending &&
            this.constructor.enabledWarnings.indexOf('change-in-update') >= 0) {
            console.warn(`An update was requested (generally because a property was set) ` +
                `after an update completed, causing a new update to be scheduled. ` +
                `This is inefficient and should be avoided unless the next update ` +
                `can only be scheduled as a side effect of the previous update.`);
        }
    }
    __markUpdated() {
        this._$changedProperties = new Map();
        this.isUpdatePending = false;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super.getUpdateComplete()`, then any subsequent state.
     *
     * @return A promise of a boolean that indicates if the update resolved
     *     without triggering another update.
     * @category updates
     */
    get updateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async getUpdateComplete() {
     *       await super.getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     * @category updates
     */
    getUpdateComplete() {
        return this.__updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    update(_changedProperties) {
        if (this.__reflectingProperties !== undefined) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this.__reflectingProperties.forEach((v, k) => this.__propertyToAttribute(k, this[k], v));
            this.__reflectingProperties = undefined;
        }
        this.__markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    updated(_changedProperties) { }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     * @category updates
     */
    firstUpdated(_changedProperties) { }
}
_f = finalized;
/**
 * Marks class as having finished creating properties.
 */
ReactiveElement[_f] = true;
/**
 * Memoized list of all element properties, including any superclass properties.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category properties
 */
ReactiveElement.elementProperties = new Map();
/**
 * Memoized list of all element styles.
 * Created lazily on user subclasses when finalizing the class.
 * @nocollapse
 * @category styles
 */
ReactiveElement.elementStyles = [];
/**
 * Options used when calling `attachShadow`. Set this property to customize
 * the options for the shadowRoot; for example, to create a closed
 * shadowRoot: `{mode: 'closed'}`.
 *
 * Note, these options are used in `createRenderRoot`. If this method
 * is customized, options should be respected if possible.
 * @nocollapse
 * @category rendering
 */
ReactiveElement.shadowRootOptions = { mode: 'open' };
// Apply polyfills if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(_c = (_b = globalThis)['reactiveElementPlatformSupport']) === null || _c === void 0 ? void 0 : _c.call(_b, { ReactiveElement });
// Dev mode warnings...
if (DEV_MODE) {
    // Default warning set.
    ReactiveElement.enabledWarnings = ['change-in-update'];
    const ensureOwnWarnings = function (ctor) {
        if (!ctor.hasOwnProperty(JSCompiler_renameProperty('enabledWarnings', ctor))) {
            ctor.enabledWarnings = ctor.enabledWarnings.slice();
        }
    };
    ReactiveElement.enableWarning = function (warning) {
        ensureOwnWarnings(this);
        if (this.enabledWarnings.indexOf(warning) < 0) {
            this.enabledWarnings.push(warning);
        }
    };
    ReactiveElement.disableWarning = function (warning) {
        ensureOwnWarnings(this);
        const i = this.enabledWarnings.indexOf(warning);
        if (i >= 0) {
            this.enabledWarnings.splice(i, 1);
        }
    };
}
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for ReactiveElement usage.
// TODO(justinfagnani): inject version number at build time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
((_d = (_e = globalThis)['reactiveElementVersions']) !== null && _d !== void 0 ? _d : (_e['reactiveElementVersions'] = [])).push('1.0.0-rc.2');
//# sourceMappingURL=reactive-element.js.map

/***/ }),

/***/ "../../node_modules/lit-element/development/lit-element.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/lit-element/development/lit-element.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.CSSResult),
/* harmony export */   "ReactiveElement": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.css),
/* harmony export */   "defaultConverter": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.defaultConverter),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.getCompatibleStyle),
/* harmony export */   "notEqual": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.notEqual),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.supportsAdoptingStyleSheets),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.unsafeCSS),
/* harmony export */   "_Σ": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__["_Σ"]),
/* harmony export */   "html": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.html),
/* harmony export */   "noChange": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange),
/* harmony export */   "nothing": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.nothing),
/* harmony export */   "render": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.render),
/* harmony export */   "svg": () => (/* reexport safe */ lit_html__WEBPACK_IMPORTED_MODULE_1__.svg),
/* harmony export */   "UpdatingElement": () => (/* binding */ UpdatingElement),
/* harmony export */   "LitElement": () => (/* binding */ LitElement),
/* harmony export */   "_Φ": () => (/* binding */ _Φ)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "../../node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "../../node_modules/lit-html/development/lit-html.js");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c, _d, _e;
var _f;
/**
 * The main LitElement module, which defines the [[`LitElement`]] base class and
 * related APIs.
 *
 *  LitElement components can define a template and a set of observed
 * properties. Changing an observed property triggers a re-render of the
 * element.
 *
 *  Import [[`LitElement`]] and [[`html`]] from this module to create a
 * component:
 *
 *  ```js
 * import {LitElement, html} from 'lit-element';
 *
 * class MyElement extends LitElement {
 *
 *   // Declare observed properties
 *   static get properties() {
 *     return {
 *       adjective: {}
 *     }
 *   }
 *
 *   constructor() {
 *     this.adjective = 'awesome';
 *   }
 *
 *   // Define the element's template
 *   render() {
 *     return html`<p>your ${adjective} template here</p>`;
 *   }
 * }
 *
 * customElements.define('my-element', MyElement);
 * ```
 *
 * `LitElement` extends [[`ReactiveElement`]] and adds lit-html templating.
 * The `ReactiveElement` class is provided for users that want to build
 * their own custom element base classes that don't use lit-html.
 *
 * @packageDocumentation
 */




// For backwards compatibility export ReactiveElement as UpdatingElement. Note,
// IE transpilation requires exporting like this.
const UpdatingElement = _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement;
const DEV_MODE = true;
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
((_a = (_f = globalThis)['litElementVersions']) !== null && _a !== void 0 ? _a : (_f['litElementVersions'] = [])).push('3.0.0-rc.2');
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the [[`properties`]] property or the [[`property`]] decorator.
 */
class LitElement extends _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement {
    constructor() {
        super(...arguments);
        /**
         * @category rendering
         */
        this.renderOptions = { host: this };
        this.__childPart = undefined;
    }
    /**
     * @category rendering
     */
    createRenderRoot() {
        var _a;
        var _b;
        const renderRoot = super.createRenderRoot();
        // When adoptedStyleSheets are shimmed, they are inserted into the
        // shadowRoot by createRenderRoot. Adjust the renderBefore node so that
        // any styles in Lit content render before adoptedStyleSheets. This is
        // important so that adoptedStyleSheets have precedence over styles in
        // the shadowRoot.
        (_a = (_b = this.renderOptions).renderBefore) !== null && _a !== void 0 ? _a : (_b.renderBefore = renderRoot.firstChild);
        return renderRoot;
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param changedProperties Map of changed properties with old values
     * @category updates
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const value = this.render();
        super.update(changedProperties);
        this.__childPart = (0,lit_html__WEBPACK_IMPORTED_MODULE_1__.render)(value, this.renderRoot, this.renderOptions);
    }
    // TODO(kschaaf): Consider debouncing directive disconnection so element moves
    // do not thrash directive callbacks
    // https://github.com/lit/lit/issues/1457
    /**
     * @category lifecycle
     */
    connectedCallback() {
        var _a;
        super.connectedCallback();
        (_a = this.__childPart) === null || _a === void 0 ? void 0 : _a.setConnected(true);
    }
    /**
     * @category lifecycle
     */
    disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        (_a = this.__childPart) === null || _a === void 0 ? void 0 : _a.setConnected(false);
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `ChildPart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     * @category rendering
     */
    render() {
        return lit_html__WEBPACK_IMPORTED_MODULE_1__.noChange;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See @lit/reactive-element for more information.
 */
LitElement['finalized'] = true;
LitElement._$litElement$ = true;
// Install hydration if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(_c = (_b = globalThis)['litElementHydrateSupport']) === null || _c === void 0 ? void 0 : _c.call(_b, { LitElement });
// Apply polyfills if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(_e = (_d = globalThis)['litElementPlatformSupport']) === null || _e === void 0 ? void 0 : _e.call(_d, { LitElement });
// DEV mode warnings
if (DEV_MODE) {
    // Note, for compatibility with closure compilation, this access
    // needs to be as a string property index.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LitElement['finalize'] = function () {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const finalized = _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__.ReactiveElement.finalize.call(this);
        if (!finalized) {
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const warnRemoved = (obj, name) => {
            if (obj[name] !== undefined) {
                console.warn(`\`${name}\` is implemented. It ` +
                    `has been removed from this version of LitElement. `
                // TODO(sorvell): add link to changelog when location has stabilized.
                // + See the changelog at https://github.com/lit/lit/blob/main/packages/lit-element/CHANGELOG.md`
                );
            }
        };
        [`render`, `getStyles`].forEach((name) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        warnRemoved(this, name));
        [`adoptStyles`].forEach((name) => 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        warnRemoved(this.prototype, name));
        return true;
    };
}
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _Φ object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-html, since this module re-exports all of lit-html.
 *
 * @private
 */
const _Φ = {
    _$attributeToProperty: (el, name, value) => {
        // eslint-disable-next-line
        el._$attributeToProperty(name, value);
    },
    // eslint-disable-next-line
    _$changedProperties: (el) => el._$changedProperties,
};
//# sourceMappingURL=lit-element.js.map

/***/ }),

/***/ "../../node_modules/lit-html/development/lit-html.js":
/*!***********************************************************!*\
  !*** ../../node_modules/lit-html/development/lit-html.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "svg": () => (/* binding */ svg),
/* harmony export */   "noChange": () => (/* binding */ noChange),
/* harmony export */   "nothing": () => (/* binding */ nothing),
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "_Σ": () => (/* binding */ _Σ)
/* harmony export */ });
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a, _b, _c, _d, _e;
var _f;
const DEV_MODE = true;
const ENABLE_EXTRA_SECURITY_HOOKS = true;
const ENABLE_SHADYDOM_NOPATCH = true;
if (DEV_MODE) {
    console.warn('lit-html is in dev mode. Not recommended for production!');
}
const wrap = ENABLE_SHADYDOM_NOPATCH && ((_a = window.ShadyDOM) === null || _a === void 0 ? void 0 : _a.inUse) &&
    ((_b = window.ShadyDOM) === null || _b === void 0 ? void 0 : _b.noPatch) === true
    ? window.ShadyDOM.wrap
    : (node) => node;
const trustedTypes = globalThis.trustedTypes;
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = trustedTypes
    ? trustedTypes.createPolicy('lit-html', {
        createHTML: (s) => s,
    })
    : undefined;
const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;
/** Sets the global sanitizer factory. */
const setSanitizer = (newSanitizer) => {
    if (!ENABLE_EXTRA_SECURITY_HOOKS) {
        return;
    }
    if (sanitizerFactoryInternal !== noopSanitizer) {
        throw new Error(`Attempted to overwrite existing lit-html security policy.` +
            ` setSanitizeDOMValueFactory should be called at most once.`);
    }
    sanitizerFactoryInternal = newSanitizer;
};
/**
 * Only used in internal tests, not a part of the public API.
 */
const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
    sanitizerFactoryInternal = noopSanitizer;
};
const createSanitizer = (node, name, type) => {
    return sanitizerFactoryInternal(node, name, type);
};
// Added to an attribute name to mark the attribute as bound so we can find
// it easily.
const boundAttributeSuffix = '$lit$';
// This marker is used in many syntactic positions in HTML, so it must be
// a valid element name and attribute name. We don't support dynamic names (yet)
// but this at least ensures that the parse tree is closer to the template
// intention.
const marker = `lit$${String(Math.random()).slice(9)}$`;
// String used to tell if a comment is a marker comment
const markerMatch = '?' + marker;
// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
const nodeMarker = `<${markerMatch}>`;
const d = document;
// Creates a dynamic marker. We never have to search for these in the DOM.
const createMarker = (v = '') => d.createComment(v);
const isPrimitive = (value) => value === null || (typeof value != 'object' && typeof value != 'function');
const isArray = Array.isArray;
const isIterable = (value) => {
    var _a;
    return isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof ((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]) === 'function';
};
const SPACE_CHAR = `[ \t\n\f\r]`;
const ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
const NAME_CHAR = `[^\\s"'>=/]`;
// These regexes represent the five parsing states that we care about in the
// Template's HTML scanner. They match the *end* of the state they're named
// after.
// Depending on the match, we transition to a new state. If there's no match,
// we stay in the same state.
// Note that the regexes are stateful. We utilize lastIndex and sync it
// across the multiple regexes used. In addition to the five regexes below
// we also dynamically create a regex to find the matching end tags for raw
// text elements.
/**
 * End of text is: `<` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
const textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single `>`
 */
const comment2EndRegex = />/g;
/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a `>`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const tagEndRegex = new RegExp(`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`, 'g');
const ENTIRE_MATCH = 0;
const ATTRIBUTE_NAME = 1;
const SPACES_AND_EQUALS = 2;
const QUOTE_CHAR = 3;
const singleQuoteAttrEndRegex = /'/g;
const doubleQuoteAttrEndRegex = /"/g;
/**
 * Matches the raw text elements.
 *
 * Comments are not parsed within raw text elements, so we need to search their
 * text content for marker strings.
 */
const rawTextElement = /^(?:script|style|textarea)$/i;
/** TemplateResult types */
const HTML_RESULT = 1;
const SVG_RESULT = 2;
// TemplatePart types
// IMPORTANT: these must match the values in PartType
const ATTRIBUTE_PART = 1;
const CHILD_PART = 2;
const PROPERTY_PART = 3;
const BOOLEAN_ATTRIBUTE_PART = 4;
const EVENT_PART = 5;
const ELEMENT_PART = 6;
const COMMENT_PART = 7;
/**
 * Generates a template literal tag function that returns a TemplateResult with
 * the given result type.
 */
const tag = (_$litType$) => (strings, ...values) => ({
    _$litType$,
    strings,
    values,
});
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = tag(HTML_RESULT);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = tag(SVG_RESULT);
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = Symbol.for('lit-noChange');
/**
 * A sentinel value that signals a ChildPart to fully clear its content.
 */
const nothing = Symbol.for('lit-nothing');
/**
 * The cache of prepared templates, keyed by the tagged TemplateStringsArray
 * and _not_ accounting for the specific template tag used. This means that
 * template tags cannot be dynamic - the must statically be one of html, svg,
 * or attr. This restriction simplifies the cache lookup, which is on the hot
 * path for rendering.
 */
const templateCache = new WeakMap();
/**
 * Renders a value, usually a lit-html TemplateResult, to the container.
 * @param value
 * @param container
 * @param options
 */
const render = (value, container, options) => {
    var _a, _b;
    const partOwnerNode = (_a = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _a !== void 0 ? _a : container;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let part = partOwnerNode._$litPart$;
    if (part === undefined) {
        const endNode = (_b = options === null || options === void 0 ? void 0 : options.renderBefore) !== null && _b !== void 0 ? _b : null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        partOwnerNode._$litPart$ = part = new ChildPart(container.insertBefore(createMarker(), endNode), endNode, undefined, options);
    }
    part._$setValue(value);
    return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
    render.setSanitizer = setSanitizer;
    render.createSanitizer = createSanitizer;
    if (DEV_MODE) {
        render._testOnlyClearSanitizerFactoryDoNotCallOrElse = _testOnlyClearSanitizerFactoryDoNotCallOrElse;
    }
}
const walker = d.createTreeWalker(d, 129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */, null, false);
let sanitizerFactoryInternal = noopSanitizer;
/**
 * Returns an HTML string for the given TemplateStringsArray and result type
 * (HTML or SVG), along with the case-sensitive bound attribute names in
 * template order. The HTML contains comment comment markers denoting the
 * `ChildPart`s and suffixes on bound attributes denoting the `AttributeParts`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing `[html, attrNames]` (array returned for terseness,
 *     to avoid object fields since this code is shared with non-minified SSR
 *     code)
 */
const getTemplateHtml = (strings, type) => {
    // Insert makers into the template HTML to represent the position of
    // bindings. The following code scans the template strings to determine the
    // syntactic position of the bindings. They can be in text position, where
    // we insert an HTML comment, attribute value position, where we insert a
    // sentinel string and re-write the attribute name, or inside a tag where
    // we insert the sentinel string.
    const l = strings.length - 1;
    // Stores the case-sensitive bound attribute names in the order of their
    // parts. ElementParts are also reflected in this array as undefined
    // rather than a string, to disambiguate from attribute bindings.
    const attrNames = [];
    let html = type === SVG_RESULT ? '<svg>' : '';
    // When we're inside a raw text tag (not it's text content), the regex
    // will still be tagRegex so we can find attributes, but will switch to
    // this regex when the tag ends.
    let rawTextEndRegex;
    // The current parsing state, represented as a reference to one of the
    // regexes
    let regex = textEndRegex;
    for (let i = 0; i < l; i++) {
        const s = strings[i];
        // The index of the end of the last attribute name. When this is
        // positive at end of a string, it means we're in an attribute value
        // position and need to rewrite the attribute name.
        // We also use a special value of -2 to indicate that we encountered
        // the end of a string in attribute name position.
        let attrNameEndIndex = -1;
        let attrName;
        let lastIndex = 0;
        let match;
        // The conditions in this loop handle the current parse state, and the
        // assignments to the `regex` variable are the state transitions.
        while (lastIndex < s.length) {
            // Make sure we start searching from where we previously left off
            regex.lastIndex = lastIndex;
            match = regex.exec(s);
            if (match === null) {
                break;
            }
            lastIndex = regex.lastIndex;
            if (regex === textEndRegex) {
                if (match[COMMENT_START] === '!--') {
                    regex = commentEndRegex;
                }
                else if (match[COMMENT_START] !== undefined) {
                    // We started a weird comment, like </{
                    regex = comment2EndRegex;
                }
                else if (match[TAG_NAME] !== undefined) {
                    if (rawTextElement.test(match[TAG_NAME])) {
                        // Record if we encounter a raw-text element. We'll switch to
                        // this regex at the end of the tag.
                        rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, 'g');
                    }
                    regex = tagEndRegex;
                }
                else if (match[DYNAMIC_TAG_NAME] !== undefined) {
                    // dynamic tag name
                    regex = tagEndRegex;
                }
            }
            else if (regex === tagEndRegex) {
                if (match[ENTIRE_MATCH] === '>') {
                    // End of a tag. If we had started a raw-text element, use that
                    // regex
                    regex = rawTextEndRegex !== null && rawTextEndRegex !== void 0 ? rawTextEndRegex : textEndRegex;
                    // We may be ending an unquoted attribute value, so make sure we
                    // clear any pending attrNameEndIndex
                    attrNameEndIndex = -1;
                }
                else if (match[ATTRIBUTE_NAME] === undefined) {
                    // Attribute name position
                    attrNameEndIndex = -2;
                }
                else {
                    attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
                    attrName = match[ATTRIBUTE_NAME];
                    regex =
                        match[QUOTE_CHAR] === undefined
                            ? tagEndRegex
                            : match[QUOTE_CHAR] === '"'
                                ? doubleQuoteAttrEndRegex
                                : singleQuoteAttrEndRegex;
                }
            }
            else if (regex === doubleQuoteAttrEndRegex ||
                regex === singleQuoteAttrEndRegex) {
                regex = tagEndRegex;
            }
            else if (regex === commentEndRegex || regex === comment2EndRegex) {
                regex = textEndRegex;
            }
            else {
                // Not one of the five state regexes, so it must be the dynamically
                // created raw text regex and we're at the close of that element.
                regex = tagEndRegex;
                rawTextEndRegex = undefined;
            }
        }
        if (DEV_MODE) {
            // If we have a attrNameEndIndex, which indicates that we should
            // rewrite the attribute name, assert that we're in a valid attribute
            // position - either in a tag, or a quoted attribute value.
            console.assert(attrNameEndIndex === -1 ||
                regex === tagEndRegex ||
                regex === singleQuoteAttrEndRegex ||
                regex === doubleQuoteAttrEndRegex, 'unexpected parse state B');
        }
        // We have four cases:
        //  1. We're in text position, and not in a raw text element
        //     (regex === textEndRegex): insert a comment marker.
        //  2. We have a non-negative attrNameEndIndex which means we need to
        //     rewrite the attribute name to add a bound attribute suffix.
        //  3. We're at the non-first binding in a multi-binding attribute, use a
        //     plain marker.
        //  4. We're somewhere else inside the tag. If we're in attribute name
        //     position (attrNameEndIndex === -2), add a sequential suffix to
        //     generate a unique attribute name.
        // Detect a binding next to self-closing tag end and insert a space to
        // separate the marker from the tag end:
        const end = regex === tagEndRegex && strings[i + 1].startsWith('/>') ? ' ' : '';
        html +=
            regex === textEndRegex
                ? s + nodeMarker
                : attrNameEndIndex >= 0
                    ? (attrNames.push(attrName),
                        s.slice(0, attrNameEndIndex) +
                            boundAttributeSuffix +
                            s.slice(attrNameEndIndex)) +
                        marker +
                        end
                    : s +
                        marker +
                        (attrNameEndIndex === -2 ? (attrNames.push(undefined), i) : end);
    }
    const htmlResult = html + (strings[l] || '<?>') + (type === SVG_RESULT ? '</svg>' : '');
    // Returned as an array for terseness
    return [
        policy !== undefined
            ? policy.createHTML(htmlResult)
            : htmlResult,
        attrNames,
    ];
};
class Template {
    constructor({ strings, _$litType$: type }, options) {
        /** @internal */
        this.parts = [];
        let node;
        let nodeIndex = 0;
        let attrNameIndex = 0;
        const partCount = strings.length - 1;
        const parts = this.parts;
        // Create template element
        const [html, attrNames] = getTemplateHtml(strings, type);
        this.el = Template.createElement(html, options);
        walker.currentNode = this.el.content;
        // Reparent SVG nodes into template root
        if (type === SVG_RESULT) {
            const content = this.el.content;
            const svgElement = content.firstChild;
            svgElement.remove();
            content.append(...svgElement.childNodes);
        }
        // Walk the template to find binding markers and create TemplateParts
        while ((node = walker.nextNode()) !== null && parts.length < partCount) {
            if (node.nodeType === 1) {
                // TODO (justinfagnani): for attempted dynamic tag names, we don't
                // increment the bindingIndex, and it'll be off by 1 in the element
                // and off by two after it.
                if (node.hasAttributes()) {
                    // We defer removing bound attributes because on IE we might not be
                    // iterating attributes in their template order, and would sometimes
                    // remove an attribute that we still need to create a part for.
                    const attrsToRemove = [];
                    for (const name of node.getAttributeNames()) {
                        // `name` is the name of the attribute we're iterating over, but not
                        // _neccessarily_ the name of the attribute we will create a part
                        // for. They can be different in browsers that don't iterate on
                        // attributes in source order. In that case the attrNames array
                        // contains the attribute name we'll process next. We only need the
                        // attribute name here to know if we should process a bound attribute
                        // on this element.
                        if (name.endsWith(boundAttributeSuffix) ||
                            name.startsWith(marker)) {
                            const realName = attrNames[attrNameIndex++];
                            attrsToRemove.push(name);
                            if (realName !== undefined) {
                                // Lowercase for case-sensitive SVG attributes like viewBox
                                const value = node.getAttribute(realName.toLowerCase() + boundAttributeSuffix);
                                const statics = value.split(marker);
                                const m = /([.?@])?(.*)/.exec(realName);
                                parts.push({
                                    type: ATTRIBUTE_PART,
                                    index: nodeIndex,
                                    name: m[2],
                                    strings: statics,
                                    ctor: m[1] === '.'
                                        ? PropertyPart
                                        : m[1] === '?'
                                            ? BooleanAttributePart
                                            : m[1] === '@'
                                                ? EventPart
                                                : AttributePart,
                                });
                            }
                            else {
                                parts.push({
                                    type: ELEMENT_PART,
                                    index: nodeIndex,
                                });
                            }
                        }
                    }
                    for (const name of attrsToRemove) {
                        node.removeAttribute(name);
                    }
                }
                // TODO (justinfagnani): benchmark the regex against testing for each
                // of the 3 raw text element names.
                if (rawTextElement.test(node.tagName)) {
                    // For raw text elements we need to split the text content on
                    // markers, create a Text node for each segment, and create
                    // a TemplatePart for each marker.
                    const strings = node.textContent.split(marker);
                    const lastIndex = strings.length - 1;
                    if (lastIndex > 0) {
                        node.textContent = trustedTypes
                            ? trustedTypes.emptyScript
                            : '';
                        // Generate a new text node for each literal section
                        // These nodes are also used as the markers for node parts
                        // We can't use empty text nodes as markers because they're
                        // normalized in some browsers (TODO: check)
                        for (let i = 0; i < lastIndex; i++) {
                            node.append(strings[i], createMarker());
                            // Walk past the marker node we just added
                            walker.nextNode();
                            parts.push({ type: CHILD_PART, index: ++nodeIndex });
                        }
                        // Note because this marker is added after the walker's current
                        // node, it will be walked to in the outer loop (and ignored), so
                        // we don't need to adjust nodeIndex here
                        node.append(strings[lastIndex], createMarker());
                    }
                }
            }
            else if (node.nodeType === 8) {
                const data = node.data;
                if (data === markerMatch) {
                    parts.push({ type: CHILD_PART, index: nodeIndex });
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        parts.push({ type: COMMENT_PART, index: nodeIndex });
                        // Move to the end of the match
                        i += marker.length - 1;
                    }
                }
            }
            nodeIndex++;
        }
    }
    // Overridden via `litHtmlPlatformSupport` to provide platform support.
    static createElement(html, _options) {
        const el = d.createElement('template');
        el.innerHTML = html;
        return el;
    }
}
function resolveDirective(part, value, parent = part, attributeIndex) {
    var _a, _b, _c;
    var _d;
    // Bail early if the value is explicitly noChange. Note, this means any
    // nested directive is still attached and is not run.
    if (value === noChange) {
        return value;
    }
    let currentDirective = attributeIndex !== undefined
        ? (_a = parent.__directives) === null || _a === void 0 ? void 0 : _a[attributeIndex] : parent.__directive;
    const nextDirectiveConstructor = isPrimitive(value)
        ? undefined
        : value._$litDirective$;
    if ((currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective.constructor) !== nextDirectiveConstructor) {
        (_b = currentDirective === null || currentDirective === void 0 ? void 0 : currentDirective._$setDirectiveConnected) === null || _b === void 0 ? void 0 : _b.call(currentDirective, false);
        if (nextDirectiveConstructor === undefined) {
            currentDirective = undefined;
        }
        else {
            currentDirective = new nextDirectiveConstructor(part);
            currentDirective._$initialize(part, parent, attributeIndex);
        }
        if (attributeIndex !== undefined) {
            ((_c = (_d = parent).__directives) !== null && _c !== void 0 ? _c : (_d.__directives = []))[attributeIndex] = currentDirective;
        }
        else {
            parent.__directive = currentDirective;
        }
    }
    if (currentDirective !== undefined) {
        value = resolveDirective(part, currentDirective._$resolve(part, value.values), currentDirective, attributeIndex);
    }
    return value;
}
/**
 * An updateable instance of a Template. Holds references to the Parts used to
 * update the template instance.
 */
class TemplateInstance {
    constructor(template, parent) {
        /** @internal */
        this._parts = [];
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$template = template;
        this._$parent = parent;
    }
    // This method is separate from the constructor because we need to return a
    // DocumentFragment and we don't want to hold onto it with an instance field.
    _clone(options) {
        var _a;
        const { el: { content }, parts: parts, } = this._$template;
        const fragment = ((_a = options === null || options === void 0 ? void 0 : options.creationScope) !== null && _a !== void 0 ? _a : d).importNode(content, true);
        walker.currentNode = fragment;
        let node = walker.nextNode();
        let nodeIndex = 0;
        let partIndex = 0;
        let templatePart = parts[0];
        while (templatePart !== undefined) {
            if (nodeIndex === templatePart.index) {
                let part;
                if (templatePart.type === CHILD_PART) {
                    part = new ChildPart(node, node.nextSibling, this, options);
                }
                else if (templatePart.type === ATTRIBUTE_PART) {
                    part = new templatePart.ctor(node, templatePart.name, templatePart.strings, this, options);
                }
                else if (templatePart.type === ELEMENT_PART) {
                    part = new ElementPart(node, this, options);
                }
                this._parts.push(part);
                templatePart = parts[++partIndex];
            }
            if (nodeIndex !== (templatePart === null || templatePart === void 0 ? void 0 : templatePart.index)) {
                node = walker.nextNode();
                nodeIndex++;
            }
        }
        return fragment;
    }
    _update(values) {
        let i = 0;
        for (const part of this._parts) {
            if (part !== undefined) {
                if (part.strings !== undefined) {
                    part._$setValue(values, part, i);
                    // The number of values the part consumes is part.strings.length - 1
                    // since values are in between template spans. We increment i by 1
                    // later in the loop, so increment it by part.strings.length - 2 here
                    i += part.strings.length - 2;
                }
                else {
                    part._$setValue(values[i]);
                }
            }
            i++;
        }
    }
}
class ChildPart {
    constructor(startNode, endNode, parent, options) {
        this.type = CHILD_PART;
        // The following fields will be patched onto ChildParts when required by
        // AsyncDirective
        /** @internal */
        this._$disconnectableChildren = undefined;
        this._$startNode = startNode;
        this._$endNode = endNode;
        this._$parent = parent;
        this.options = options;
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            // Explicitly initialize for consistent class shape.
            this._textSanitizer = undefined;
        }
    }
    /**
     * Sets the connection state for any `AsyncDirectives` contained
     * within this part and runs their `disconnected` or `reconnected`, according
     * to the `isConnected` argument.
     */
    setConnected(isConnected) {
        var _a;
        (_a = this._$setChildPartConnected) === null || _a === void 0 ? void 0 : _a.call(this, isConnected);
    }
    /**
     * The parent node into which the part renders its content.
     *
     * A ChildPart's content consists of a range of adjacent child nodes of
     * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
     * `.endNode`).
     *
     * - If both `.startNode` and `.endNode` are non-null, then the part's content
     * consists of all siblings between `.startNode` and `.endNode`, exclusively.
     *
     * - If `.startNode` is non-null but `.endNode` is null, then the part's
     * content consists of all siblings following `.startNode`, up to and
     * including the last child of `.parentNode`. If `.endNode` is non-null, then
     * `.startNode` will always be non-null.
     *
     * - If both `.endNode` and `.startNode` are null, then the part's content
     * consists of all child nodes of `.parentNode`.
     */
    get parentNode() {
        return wrap(this._$startNode).parentNode;
    }
    /**
     * The part's leading marker node, if any. See `.parentNode` for more
     * information.
     */
    get startNode() {
        return this._$startNode;
    }
    /**
     * The part's trailing marker node, if any. See `.parentNode` for more
     * information.
     */
    get endNode() {
        return this._$endNode;
    }
    _$setValue(value, directiveParent = this) {
        value = resolveDirective(this, value, directiveParent);
        if (isPrimitive(value)) {
            // Non-rendering child values. It's important that these do not render
            // empty text nodes to avoid issues with preventing default <slot>
            // fallback content.
            if (value === nothing || value == null || value === '') {
                if (this._$committedValue !== nothing) {
                    this._$clear();
                }
                this._$committedValue = nothing;
            }
            else if (value !== this._$committedValue && value !== noChange) {
                this._commitText(value);
            }
        }
        else if (value._$litType$ !== undefined) {
            this._commitTemplateResult(value);
        }
        else if (value.nodeType !== undefined) {
            this._commitNode(value);
        }
        else if (isIterable(value)) {
            this._commitIterable(value);
        }
        else {
            // Fallback, will render the string representation
            this._commitText(value);
        }
    }
    _insert(node, ref = this._$endNode) {
        return wrap(wrap(this._$startNode).parentNode).insertBefore(node, ref);
    }
    _commitNode(value) {
        var _a;
        if (this._$committedValue !== value) {
            this._$clear();
            if (ENABLE_EXTRA_SECURITY_HOOKS &&
                sanitizerFactoryInternal !== noopSanitizer) {
                const parentNodeName = (_a = this._$startNode.parentNode) === null || _a === void 0 ? void 0 : _a.nodeName;
                if (parentNodeName === 'STYLE' || parentNodeName === 'SCRIPT') {
                    this._insert(new Text('/* lit-html will not write ' +
                        'TemplateResults to scripts and styles */'));
                    return;
                }
            }
            this._$committedValue = this._insert(value);
        }
    }
    _commitText(value) {
        const node = wrap(this._$startNode).nextSibling;
        // TODO(justinfagnani): Can we just check if this._$committedValue is primitive?
        if (node !== null &&
            node.nodeType === 3 /* Node.TEXT_NODE */ &&
            (this._$endNode === null
                ? wrap(node).nextSibling === null
                : node === wrap(this._$endNode).previousSibling)) {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(node, 'data', 'property');
                }
                value = this._textSanitizer(value);
            }
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            node.data = value;
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                const textNode = document.createTextNode('');
                this._commitNode(textNode);
                // When setting text content, for security purposes it matters a lot
                // what the parent is. For example, <style> and <script> need to be
                // handled with care, while <span> does not. So first we need to put a
                // text node into the document, then we can sanitize its contentx.
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(textNode, 'data', 'property');
                }
                value = this._textSanitizer(value);
                textNode.data = value;
            }
            else {
                this._commitNode(d.createTextNode(value));
            }
        }
        this._$committedValue = value;
    }
    _commitTemplateResult(result) {
        var _a;
        const { values, _$litType$ } = result;
        // If $litType$ is a number, result is a plain TemplateResult and we get
        // the template from the template cache. If not, result is a
        // CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
        // to create the <template> element the first time we see it.
        const template = typeof _$litType$ === 'number'
            ? this._$getTemplate(result)
            : (_$litType$.el === undefined &&
                (_$litType$.el = Template.createElement(_$litType$.h, this.options)),
                _$litType$);
        if (((_a = this._$committedValue) === null || _a === void 0 ? void 0 : _a._$template) === template) {
            this._$committedValue._update(values);
        }
        else {
            const instance = new TemplateInstance(template, this);
            const fragment = instance._clone(this.options);
            instance._update(values);
            this._commitNode(fragment);
            this._$committedValue = instance;
        }
    }
    // Overridden via `litHtmlPlatformSupport` to provide platform support.
    /** @internal */
    _$getTemplate(result) {
        let template = templateCache.get(result.strings);
        if (template === undefined) {
            templateCache.set(result.strings, (template = new Template(result)));
        }
        return template;
    }
    _commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If value is an array, then the previous render was of an
        // iterable and value will contain the ChildParts from the previous
        // render. If value is not an array, clear this part and make a new
        // array for ChildParts.
        if (!isArray(this._$committedValue)) {
            this._$committedValue = [];
            this._$clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._$committedValue;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            if (partIndex === itemParts.length) {
                // If no existing part, create a new one
                // TODO (justinfagnani): test perf impact of always creating two parts
                // instead of sharing parts between nodes
                // https://github.com/lit/lit/issues/1266
                itemParts.push((itemPart = new ChildPart(this._insert(createMarker()), this._insert(createMarker()), this, this.options)));
            }
            else {
                // Reuse an existing part
                itemPart = itemParts[partIndex];
            }
            itemPart._$setValue(item);
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // itemParts always have end nodes
            this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
        }
    }
    /**
     * Removes the nodes contained within this Part from the DOM.
     *
     * @param start Start node to clear from, for clearing a subset of the part's
     *     DOM (used when truncating iterables)
     * @param from  When `start` is specified, the index within the iterable from
     *     which ChildParts are being removed, used for disconnecting directives in
     *     those Parts.
     *
     * @internal
     */
    _$clear(start = wrap(this._$startNode).nextSibling, from) {
        var _a;
        (_a = this._$setChildPartConnected) === null || _a === void 0 ? void 0 : _a.call(this, false, true, from);
        while (start && start !== this._$endNode) {
            const n = wrap(start).nextSibling;
            wrap(start).remove();
            start = n;
        }
    }
}
class AttributePart {
    constructor(element, name, strings, parent, options) {
        this.type = ATTRIBUTE_PART;
        /** @internal */
        this._$committedValue = nothing;
        /** @internal */
        this._$disconnectableChildren = undefined;
        /** @internal */
        this._setDirectiveConnected = undefined;
        this.element = element;
        this.name = name;
        this._$parent = parent;
        this.options = options;
        if (strings.length > 2 || strings[0] !== '' || strings[1] !== '') {
            this._$committedValue = new Array(strings.length - 1).fill(nothing);
            this.strings = strings;
        }
        else {
            this._$committedValue = nothing;
        }
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            this._sanitizer = undefined;
        }
    }
    get tagName() {
        return this.element.tagName;
    }
    /**
     * Sets the value of this part by resolving the value from possibly multiple
     * values and static strings and committing it to the DOM.
     * If this part is single-valued, `this._strings` will be undefined, and the
     * method will be called with a single value argument. If this part is
     * multi-value, `this._strings` will be defined, and the method is called
     * with the value array of the part's owning TemplateInstance, and an offset
     * into the value array from which the values should be read.
     * This method is overloaded this way to eliminate short-lived array slices
     * of the template instance values, and allow a fast-path for single-valued
     * parts.
     *
     * @param value The part value, or an array of values for multi-valued parts
     * @param valueIndex the index to start reading values from. `undefined` for
     *   single-valued parts
     * @param noCommit causes the part to not commit its value to the DOM. Used
     *   in hydration to prime attribute parts with their first-rendered value,
     *   but not set the attribute, and in SSR to no-op the DOM operation and
     *   capture the value for serialization.
     *
     * @internal
     */
    _$setValue(value, directiveParent = this, valueIndex, noCommit) {
        const strings = this.strings;
        // Whether any of the values has changed, for dirty-checking
        let change = false;
        if (strings === undefined) {
            // Single-value binding case
            value = resolveDirective(this, value, directiveParent, 0);
            change =
                !isPrimitive(value) ||
                    (value !== this._$committedValue && value !== noChange);
            if (change) {
                this._$committedValue = value;
            }
        }
        else {
            // Interpolation case
            const values = value;
            value = strings[0];
            let i, v;
            for (i = 0; i < strings.length - 1; i++) {
                v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
                if (v === noChange) {
                    // If the user-provided value is `noChange`, use the previous value
                    v = this._$committedValue[i];
                }
                change || (change = !isPrimitive(v) || v !== this._$committedValue[i]);
                if (v === nothing) {
                    value = nothing;
                }
                else if (value !== nothing) {
                    value += (v !== null && v !== void 0 ? v : '') + strings[i + 1];
                }
                // We always record each value, even if one is `nothing`, for future
                // change detection.
                this._$committedValue[i] = v;
            }
        }
        if (change && !noCommit) {
            this._commitValue(value);
        }
    }
    /** @internal */
    _commitValue(value) {
        if (value === nothing) {
            wrap(this.element).removeAttribute(this.name);
        }
        else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._sanitizer === undefined) {
                    this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'attribute');
                }
                value = this._sanitizer(value !== null && value !== void 0 ? value : '');
            }
            wrap(this.element).setAttribute(this.name, (value !== null && value !== void 0 ? value : ''));
        }
    }
}
class PropertyPart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = PROPERTY_PART;
    }
    /** @internal */
    _commitValue(value) {
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            if (this._sanitizer === undefined) {
                this._sanitizer = sanitizerFactoryInternal(this.element, this.name, 'property');
            }
            value = this._sanitizer(value);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.element[this.name] = value === nothing ? undefined : value;
    }
}
class BooleanAttributePart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = BOOLEAN_ATTRIBUTE_PART;
    }
    /** @internal */
    _commitValue(value) {
        if (value && value !== nothing) {
            wrap(this.element).setAttribute(this.name, '');
        }
        else {
            wrap(this.element).removeAttribute(this.name);
        }
    }
}
class EventPart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = EVENT_PART;
    }
    // EventPart does not use the base _$setValue/_resolveValue implementation
    // since the dirty checking is more complex
    /** @internal */
    _$setValue(newListener, directiveParent = this) {
        var _a;
        newListener = (_a = resolveDirective(this, newListener, directiveParent, 0)) !== null && _a !== void 0 ? _a : nothing;
        if (newListener === noChange) {
            return;
        }
        const oldListener = this._$committedValue;
        // If the new value is nothing or any options change we have to remove the
        // part as a listener.
        const shouldRemoveListener = (newListener === nothing && oldListener !== nothing) ||
            newListener.capture !==
                oldListener.capture ||
            newListener.once !==
                oldListener.once ||
            newListener.passive !==
                oldListener.passive;
        // If the new value is not nothing and we removed the listener, we have
        // to add the part as a listener.
        const shouldAddListener = newListener !== nothing &&
            (oldListener === nothing || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.name, this, oldListener);
        }
        if (shouldAddListener) {
            // Beware: IE11 and Chrome 41 don't like using the listener as the
            // options object. Figure out how to deal w/ this in IE11 - maybe
            // patch addEventListener?
            this.element.addEventListener(this.name, this, newListener);
        }
        this._$committedValue = newListener;
    }
    handleEvent(event) {
        var _a, _b;
        if (typeof this._$committedValue === 'function') {
            // TODO (justinfagnani): do we need to default to this.element?
            // It'll always be the same as `e.currentTarget`.
            this._$committedValue.call((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : this.element, event);
        }
        else {
            this._$committedValue.handleEvent(event);
        }
    }
}
class ElementPart {
    constructor(element, parent, options) {
        this.element = element;
        this.type = ELEMENT_PART;
        /** @internal */
        this._$disconnectableChildren = undefined;
        /** @internal */
        this._setDirectiveConnected = undefined;
        this._$parent = parent;
        this.options = options;
    }
    _$setValue(value) {
        resolveDirective(this, value);
    }
}
/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports  mangled in the
 * client side code, we export a _Σ object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-export them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-element, which re-exports all of lit-html.
 *
 * @private
 */
const _Σ = {
    // Used in lit-ssr
    _boundAttributeSuffix: boundAttributeSuffix,
    _marker: marker,
    _markerMatch: markerMatch,
    _HTML_RESULT: HTML_RESULT,
    _getTemplateHtml: getTemplateHtml,
    // Used in hydrate
    _TemplateInstance: TemplateInstance,
    _isIterable: isIterable,
    _resolveDirective: resolveDirective,
    // Used in tests and private-ssr-support
    _ChildPart: ChildPart,
    _AttributePart: AttributePart,
    _BooleanAttributePart: BooleanAttributePart,
    _EventPart: EventPart,
    _PropertyPart: PropertyPart,
    _ElementPart: ElementPart,
};
// Apply polyfills if available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(_d = (_c = globalThis)['litHtmlPlatformSupport']) === null || _d === void 0 ? void 0 : _d.call(_c, Template, ChildPart);
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
((_e = (_f = globalThis)['litHtmlVersions']) !== null && _e !== void 0 ? _e : (_f['litHtmlVersions'] = [])).push('2.0.0-rc.3');
//# sourceMappingURL=lit-html.js.map

/***/ }),

/***/ "../../node_modules/lit/decorators.js":
/*!********************************************!*\
  !*** ../../node_modules/lit/decorators.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customElement": () => (/* reexport safe */ _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__.customElement),
/* harmony export */   "property": () => (/* reexport safe */ _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__.property),
/* harmony export */   "state": () => (/* reexport safe */ _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__.state),
/* harmony export */   "eventOptions": () => (/* reexport safe */ _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__.eventOptions),
/* harmony export */   "query": () => (/* reexport safe */ _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__.query),
/* harmony export */   "queryAll": () => (/* reexport safe */ _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__.queryAll),
/* harmony export */   "queryAsync": () => (/* reexport safe */ _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__.queryAsync),
/* harmony export */   "queryAssignedNodes": () => (/* reexport safe */ _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_7__.queryAssignedNodes)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element_decorators_custom_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element/decorators/custom-element.js */ "../../node_modules/@lit/reactive-element/development/decorators/custom-element.js");
/* harmony import */ var _lit_reactive_element_decorators_property_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lit/reactive-element/decorators/property.js */ "../../node_modules/@lit/reactive-element/development/decorators/property.js");
/* harmony import */ var _lit_reactive_element_decorators_state_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lit/reactive-element/decorators/state.js */ "../../node_modules/@lit/reactive-element/development/decorators/state.js");
/* harmony import */ var _lit_reactive_element_decorators_event_options_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lit/reactive-element/decorators/event-options.js */ "../../node_modules/@lit/reactive-element/development/decorators/event-options.js");
/* harmony import */ var _lit_reactive_element_decorators_query_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lit/reactive-element/decorators/query.js */ "../../node_modules/@lit/reactive-element/development/decorators/query.js");
/* harmony import */ var _lit_reactive_element_decorators_query_all_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-all.js */ "../../node_modules/@lit/reactive-element/development/decorators/query-all.js");
/* harmony import */ var _lit_reactive_element_decorators_query_async_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-async.js */ "../../node_modules/@lit/reactive-element/development/decorators/query-async.js");
/* harmony import */ var _lit_reactive_element_decorators_query_assigned_nodes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @lit/reactive-element/decorators/query-assigned-nodes.js */ "../../node_modules/@lit/reactive-element/development/decorators/query-assigned-nodes.js");

//# sourceMappingURL=decorators.js.map


/***/ }),

/***/ "../../node_modules/lit/index.js":
/*!***************************************!*\
  !*** ../../node_modules/lit/index.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSSResult": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.CSSResult),
/* harmony export */   "LitElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.LitElement),
/* harmony export */   "ReactiveElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.ReactiveElement),
/* harmony export */   "UpdatingElement": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.UpdatingElement),
/* harmony export */   "_Σ": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__["_Σ"]),
/* harmony export */   "_Φ": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__["_Φ"]),
/* harmony export */   "adoptStyles": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.adoptStyles),
/* harmony export */   "css": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.css),
/* harmony export */   "defaultConverter": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.defaultConverter),
/* harmony export */   "getCompatibleStyle": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.getCompatibleStyle),
/* harmony export */   "html": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.html),
/* harmony export */   "noChange": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.noChange),
/* harmony export */   "notEqual": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.notEqual),
/* harmony export */   "nothing": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.nothing),
/* harmony export */   "render": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.render),
/* harmony export */   "supportsAdoptingStyleSheets": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.supportsAdoptingStyleSheets),
/* harmony export */   "svg": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.svg),
/* harmony export */   "unsafeCSS": () => (/* reexport safe */ lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__.unsafeCSS)
/* harmony export */ });
/* harmony import */ var _lit_reactive_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lit/reactive-element */ "../../node_modules/@lit/reactive-element/development/reactive-element.js");
/* harmony import */ var lit_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit-html */ "../../node_modules/lit-html/development/lit-html.js");
/* harmony import */ var lit_element_lit_element_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lit-element/lit-element.js */ "../../node_modules/lit-element/development/lit-element.js");

//# sourceMappingURL=index.js.map


/***/ }),

/***/ "../map-editor-components/dist/AutoTileSelectorComponent.js":
/*!******************************************************************!*\
  !*** ../map-editor-components/dist/AutoTileSelectorComponent.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoTileSelectorComponent": () => (/* binding */ AutoTileSelectorComponent)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "../../node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "../../node_modules/lit/decorators.js");
/* harmony import */ var _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Helpers/CursorPositionCalculator */ "../map-editor-components/dist/Helpers/CursorPositionCalculator.js");
/* harmony import */ var _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @piyoppi/pico2map-editor */ "../map-editor/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




class AutoTileSelectorComponent extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super(...arguments);
        this._gridImageSrc = '';
        this.gridImageGenerator = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.GridImageGenerator();
        this.cursorPositionCalculator = new _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__.CursorPositionCalculator();
        this._indexImage = document.createElement('canvas');
        this._project = null;
        this._autoTileSelector = null;
        this._afterAddAutoTileCallbackItem = null;
        this._afterRemoveAutoTileCallbackItem = null;
        this._afterReplacedMapChipImageCallbackItem = null;
        this._projectId = -1;
        this._width = 192;
        this.cursorChipX = 0;
        this.cursorChipY = 0;
        this.selectedChipY = -1;
        this.selectedChipX = -1;
        this.indexImageSrc = '';
    }
    get gridColor() {
        return this.gridImageGenerator.gridColor;
    }
    set gridColor(value) {
        const oldValue = this.gridImageGenerator.gridColor;
        this.gridImageGenerator.gridColor = value;
        this.requestUpdate('gridColor', oldValue);
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        const oldValue = this._projectId;
        this._projectId = value;
        this._setupProject();
        this.setupMapChipSelector();
        this.requestUpdate('projectId', oldValue);
    }
    get width() {
        return this._width;
    }
    set width(value) {
        const oldValue = this._width;
        this._width = value;
        this.setupMapChipSelector();
        this.requestUpdate('width', oldValue);
    }
    get project() {
        return this._project;
    }
    get gridWidth() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipWidth) || 0;
    }
    get gridHeight() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipHeight) || 0;
    }
    get cursorPosition() {
        return {
            x: this.cursorChipX * this.gridWidth,
            y: this.cursorChipY * this.gridHeight
        };
    }
    get selectedPosition() {
        return {
            x: this.selectedChipX * this.gridWidth,
            y: this.selectedChipY * this.gridHeight
        };
    }
    get subscribedProjectEvent() {
        return !!this._afterAddAutoTileCallbackItem && !!this._afterRemoveAutoTileCallbackItem && !!this._afterReplacedMapChipImageCallbackItem;
    }
    _setupProject() {
        var _a;
        if (((_a = this._project) === null || _a === void 0 ? void 0 : _a.projectId) === this._projectId)
            return;
        if (this._project) {
            this._unsubscribeProjectEvent();
        }
        this._project = _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.Projects.fromProjectId(this._projectId);
        if (!this._project) {
            this.reset();
            return;
        }
        this._subscribeProjectEvent();
        this._autoTileSelector = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.AutoTileSelector(this.width, this._project.tiledMap.chipWidth, this._project.tiledMap.chipHeight, this._project.tiledMap.autoTiles, this._project.tiledMap.mapChipsCollection);
        this.selectedChipX = -1;
        this.selectedChipY = -1;
    }
    _subscribeProjectEvent() {
        if (!this._project)
            return;
        if (!this._afterAddAutoTileCallbackItem)
            this._afterAddAutoTileCallbackItem = this._project.setCallback('afterAddAutoTile', () => this.setupMapChipSelector());
        if (!this._afterRemoveAutoTileCallbackItem)
            this._afterRemoveAutoTileCallbackItem = this._project.setCallback('afterRemoveAutoTile', () => this.setupMapChipSelector());
        if (!this._afterReplacedMapChipImageCallbackItem)
            this._afterReplacedMapChipImageCallbackItem = this._project.setCallback('afterReplacedMapChipImage', () => this.setupMapChipSelector());
    }
    _unsubscribeProjectEvent() {
        if (!this._project)
            return;
        if (this._afterAddAutoTileCallbackItem)
            this._project.removeCallback('afterAddAutoTile', this._afterAddAutoTileCallbackItem);
        if (this._afterRemoveAutoTileCallbackItem)
            this._project.removeCallback('afterRemoveAutoTile', this._afterRemoveAutoTileCallbackItem);
        if (this._afterReplacedMapChipImageCallbackItem)
            this._project.removeCallback('afterReplacedMapChipImage', this._afterReplacedMapChipImageCallbackItem);
        this._afterAddAutoTileCallbackItem = null;
        this._afterRemoveAutoTileCallbackItem = null;
        this._afterReplacedMapChipImageCallbackItem = null;
    }
    reset() {
        this.indexImageSrc = '';
    }
    setupMapChipSelector() {
        if (!this._project || !this._autoTileSelector)
            return;
        if (this._project.tiledMap.autoTiles.length > 0) {
            this._autoTileSelector.canvasWidth = this.width;
            const imageSize = this._autoTileSelector.getSizeOfIndexImage();
            this._indexImage.width = imageSize.width;
            this._indexImage.height = imageSize.height;
            this._autoTileSelector.generateIndexImage(this._indexImage);
            this.indexImageSrc = this._indexImage.toDataURL();
        }
        else {
            this.reset();
        }
    }
    mouseMove(e) {
        if (!this._autoTileSelector)
            return;
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        const position = this._autoTileSelector.convertFromIndexImageToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y);
        this.cursorChipX = position.x;
        this.cursorChipY = position.y;
    }
    mouseDown(e) {
        if (!this._project || !this._autoTileSelector)
            return;
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        const selectedAutoTile = this._autoTileSelector.getAutoTileFragmentFromIndexImagePosition(mouseCursorPosition.x, mouseCursorPosition.y);
        if (!selectedAutoTile)
            return;
        this.selectedChipX = Math.floor(mouseCursorPosition.x / this._project.tiledMap.chipWidth);
        this.selectedChipY = Math.floor(mouseCursorPosition.y / this._project.tiledMap.chipHeight);
        this.dispatchEvent(new CustomEvent('autotile-selected', {
            detail: { id: selectedAutoTile.id },
            bubbles: true,
            composed: true
        }));
    }
    firstUpdated() {
        var _a;
        const element = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('boundary');
        if (element)
            this.cursorPositionCalculator.setElement(element);
    }
    render() {
        this.gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight);
        if (this.gridImageGenerator.changed) {
            this._gridImageSrc = this.gridImageGenerator.generateLinePart().toDataURL();
        }
        const cursorWidth = this.gridWidth;
        const cursorHeight = this.gridHeight;
        return lit__WEBPACK_IMPORTED_MODULE_0__.html `
      <style>
        .grid {
          background-image: url("${this._gridImageSrc}");
          width: ${this._indexImage.width}px;
          height: ${this._indexImage.height}px;
        }

        .cursor {
          width: ${cursorWidth}px;
          height: ${cursorHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .selected {
          width: ${cursorWidth}px;
          height: ${cursorHeight}px;
          left: ${this.selectedPosition.x}px;
          top: ${this.selectedPosition.y}px;
        }
      </style>

      <div id="boundary">
        ${this.indexImageSrc ? lit__WEBPACK_IMPORTED_MODULE_0__.html `
          <img id="chip-image" src="${this.indexImageSrc}">
          <div
            class="grid-image grid"
            @mousemove="${(e) => this.mouseMove(e)}"
            @mousedown="${(e) => this.mouseDown(e)}"
          ></div>
          <div class="cursor"></div>
          ${(this.selectedChipX >= 0 && this.selectedChipY >= 0) ? lit__WEBPACK_IMPORTED_MODULE_0__.html `<div class="selected"></div>` : null}
        ` : null}
      </div>
    `;
    }
    static get styles() {
        return lit__WEBPACK_IMPORTED_MODULE_0__.css `
      .grid-image {
        position: absolute;
        top: 0;
        left: 0;
        background-repeat: repeat;
      }

      .cursor, .selected {
        position: absolute;
        border-style: solid;
        box-sizing: border-box;
      }

      .cursor {
        border-color: red;
        pointer-events: none;
      }

      .selected {
        border-color: blue;
        pointer-events: none;
      }

      #boundary {
        position: relative;
      }

      #chip-image {
        display: block;
        user-select: none;
      }
    `;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribeProjectEvent();
    }
    connectedCallback() {
        super.connectedCallback();
        this._subscribeProjectEvent();
    }
}
AutoTileSelectorComponent.Format = {
    width: 1,
    height: 5
};
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], AutoTileSelectorComponent.prototype, "gridColor", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], AutoTileSelectorComponent.prototype, "projectId", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], AutoTileSelectorComponent.prototype, "width", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], AutoTileSelectorComponent.prototype, "cursorChipX", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], AutoTileSelectorComponent.prototype, "cursorChipY", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], AutoTileSelectorComponent.prototype, "selectedChipY", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], AutoTileSelectorComponent.prototype, "selectedChipX", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], AutoTileSelectorComponent.prototype, "indexImageSrc", void 0);


/***/ }),

/***/ "../map-editor-components/dist/ColisionMarkerComponent.js":
/*!****************************************************************!*\
  !*** ../map-editor-components/dist/ColisionMarkerComponent.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColiderMarkerComponent": () => (/* binding */ ColiderMarkerComponent)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "../../node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "../../node_modules/lit/decorators.js");
/* harmony import */ var _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Helpers/CursorPositionCalculator */ "../map-editor-components/dist/Helpers/CursorPositionCalculator.js");
/* harmony import */ var _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @piyoppi/pico2map-editor */ "../map-editor/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




class ColiderMarkerComponent extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super();
        this._gridImageSrc = '';
        this._gridImageGenerator = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.GridImageGenerator();
        this._cursorPositionCalculator = new _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__.CursorPositionCalculator();
        this._coliderCanvas = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.ColiderCanvas();
        this._project = null;
        this._coliderCanvasElement = null;
        this._secondaryCanvasElement = null;
        this._documentMouseMoveEventCallee = null;
        this._documentMouseUpEventCallee = null;
        this.cursorChipX = 0;
        this.cursorChipY = 0;
        this.preventDefaultContextMenu = true;
        this._projectId = -1;
        this._brushName = '';
        _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.Projects.setProjectAddCallbackFunction(() => this.setupProject());
    }
    get gridColor() {
        return this._gridImageGenerator.gridColor;
    }
    set gridColor(value) {
        const oldValue = this._gridImageGenerator.gridColor;
        this._gridImageGenerator.gridColor = value;
        this.requestUpdate('gridColor', oldValue);
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        const oldValue = this._projectId;
        this._projectId = value;
        this.setupProject();
        this.requestUpdate('projectId', oldValue);
    }
    get brush() {
        return this._brushName;
    }
    set brush(value) {
        const oldValue = this._brushName;
        this._brushName = value;
        this._coliderCanvas.setBrushFromName(this._brushName);
        this.requestUpdate('brush', oldValue);
    }
    get coliderType() {
        return this._coliderCanvas.selectedColiderType;
    }
    set coliderType(value) {
        const oldValue = value;
        this.requestUpdate('coliderType', oldValue);
        this._coliderCanvas.setColiderType(value);
    }
    get subColiderType() {
        return this._coliderCanvas.selectedSubColiderType;
    }
    set subColiderType(value) {
        const oldValue = value;
        this.requestUpdate('subColiderType', oldValue);
        this._coliderCanvas.setSubColiderType(value);
    }
    get width() {
        return this.xCount * this.gridWidth;
    }
    get height() {
        return this.yCount * this.gridHeight;
    }
    get xCount() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipCountX) || 0;
    }
    get yCount() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipCountY) || 0;
    }
    get gridWidth() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipWidth) || 0;
    }
    get gridHeight() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipHeight) || 0;
    }
    get cursorPosition() {
        return {
            x: this.cursorChipX * this.gridWidth,
            y: this.cursorChipY * this.gridHeight
        };
    }
    get coliderCanvas() {
        return this._coliderCanvas;
    }
    setupProject() {
        if (this._project && this._project.projectId === this._projectId)
            return;
        if (this._project) {
            this._coliderCanvas.unsubscribeProjectEvent();
        }
        this._project = _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.Projects.fromProjectId(this._projectId);
        if (!this._project)
            return;
        this._coliderCanvas.setProject(this._project);
        if (!this._coliderCanvas.isSubscribedProjectEvent)
            this._coliderCanvas.subscribeProjectEvent();
        this.requestUpdate();
    }
    firstUpdated() {
        var _a, _b, _c;
        const element = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('boundary');
        if (element)
            this._cursorPositionCalculator.setElement(element);
        this._coliderCanvasElement = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('colider-canvas');
        this._secondaryCanvasElement = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById('secondary-canvas');
        if (this._secondaryCanvasElement && this._coliderCanvasElement) {
            this._coliderCanvas.setCanvas(this._coliderCanvasElement, this._secondaryCanvasElement);
        }
    }
    mouseMove(e) {
        const mouseCursorPosition = this._cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        const cursor = this._coliderCanvas.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y);
        this.cursorChipX = cursor.x;
        this.cursorChipY = cursor.y;
    }
    mouseDown(e) {
        const mouseCursorPosition = this._cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        this._coliderCanvas.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y, e.button === 2);
        this._documentMouseMoveEventCallee = e => this.mouseMove(e);
        this._documentMouseUpEventCallee = e => this.mouseUp(e);
        document.addEventListener('mousemove', this._documentMouseMoveEventCallee);
        document.addEventListener('mouseup', this._documentMouseUpEventCallee);
    }
    mouseUp(e) {
        const mouseCursorPosition = this._cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        this._coliderCanvas.mouseUp(mouseCursorPosition.x, mouseCursorPosition.y);
        if (this._documentMouseMoveEventCallee)
            document.removeEventListener('mousemove', this._documentMouseMoveEventCallee);
        if (this._documentMouseUpEventCallee)
            document.removeEventListener('mouseup', this._documentMouseUpEventCallee);
        this._documentMouseMoveEventCallee = null;
        this._documentMouseUpEventCallee = null;
    }
    render() {
        this._gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight);
        if (this._gridImageGenerator.changed) {
            this._gridImageSrc = this._gridImageGenerator.generateLinePart().toDataURL();
        }
        return lit__WEBPACK_IMPORTED_MODULE_0__.html `
      <style>
        .grid {
          background-image: url("${this._gridImageSrc}");
        }

        #boundary {
          width: ${this.width + 1}px;
          height: ${this.height + 1}px;
        }

        .cursor {
          width: ${this.gridWidth}px;
          height: ${this.gridHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .grid-image {
          background-position: 1px 1px
        }
      </style>

      <div id="boundary">
        <canvas
          id="colider-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
        <canvas
          id="secondary-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
        <div
          class="grid-image grid"
          @mousedown="${(e) => this.mouseDown(e)}"
          @mousemove="${(e) => !this._coliderCanvas.isMouseDown ? this.mouseMove(e) : null}"
          @contextmenu="${(e) => this.preventDefaultContextMenu && e.preventDefault()}"
        ></div>
        <div class="cursor"></div>
      </div>
    `;
    }
    static get styles() {
        return lit__WEBPACK_IMPORTED_MODULE_0__.css `
      .grid-image {
        position: absolute;
        top: 0;
        left: 0;
        background-repeat: repeat;
        width: 100%;
        height: 100%;
      }

      .cursor {
        position: absolute;
        border-style: solid;
        box-sizing: border-box;
        border-color: red;
        pointer-events: none;
      }

      #boundary {
        position: relative;
      }

      #secondary-canvas, #colider-canvas {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._coliderCanvas.unsubscribeProjectEvent();
    }
    connectedCallback() {
        super.connectedCallback();
        if (this._coliderCanvas.hasProject && !this._coliderCanvas.isSubscribedProjectEvent)
            this._coliderCanvas.subscribeProjectEvent();
    }
}
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], ColiderMarkerComponent.prototype, "cursorChipX", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], ColiderMarkerComponent.prototype, "cursorChipY", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], ColiderMarkerComponent.prototype, "preventDefaultContextMenu", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], ColiderMarkerComponent.prototype, "gridColor", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], ColiderMarkerComponent.prototype, "projectId", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], ColiderMarkerComponent.prototype, "brush", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], ColiderMarkerComponent.prototype, "coliderType", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], ColiderMarkerComponent.prototype, "subColiderType", null);


/***/ }),

/***/ "../map-editor-components/dist/Events.js":
/*!***********************************************!*\
  !*** ../map-editor-components/dist/Events.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapChipSelectedEvent": () => (/* binding */ MapChipSelectedEvent),
/* harmony export */   "AutoTileSelectedEvent": () => (/* binding */ AutoTileSelectedEvent),
/* harmony export */   "PickedMapChipEvent": () => (/* binding */ PickedMapChipEvent)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class MapChipSelectedEvent extends CustomEvent {
    constructor(detail) {
        super('mapchip-selected', { detail });
    }
}
class AutoTileSelectedEvent extends CustomEvent {
    constructor(detail) {
        super('autotile-selected', { detail });
    }
}
class PickedMapChipEvent extends CustomEvent {
    constructor(detail) {
        super('mapchip-picked', { detail });
    }
}


/***/ }),

/***/ "../map-editor-components/dist/Helpers/CursorPositionCalculator.js":
/*!*************************************************************************!*\
  !*** ../map-editor-components/dist/Helpers/CursorPositionCalculator.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CursorPositionCalculator": () => (/* binding */ CursorPositionCalculator)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class CursorPositionCalculator {
    constructor() {
        this._element = null;
    }
    setElement(element) {
        this._element = element;
    }
    getMouseCursorPosition(pageX, pageY) {
        if (!this._element)
            return { x: 0, y: 0 };
        const rect = this._element.getBoundingClientRect();
        return {
            x: (pageX - window.scrollX - rect.x),
            y: (pageY - window.scrollY - rect.y)
        };
    }
}


/***/ }),

/***/ "../map-editor-components/dist/MapCanvasComponent.js":
/*!***********************************************************!*\
  !*** ../map-editor-components/dist/MapCanvasComponent.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapCanvasComponent": () => (/* binding */ MapCanvasComponent)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "../../node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "../../node_modules/lit/decorators.js");
/* harmony import */ var _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Helpers/CursorPositionCalculator */ "../map-editor-components/dist/Helpers/CursorPositionCalculator.js");
/* harmony import */ var _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @piyoppi/pico2map-editor */ "../map-editor/dist/main.js");
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





class MapCanvasComponent extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super();
        this.cursorPositionCalculator = new _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__.CursorPositionCalculator();
        this._mapCanvas = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.MapCanvas();
        this._project = null;
        this._secondaryCanvasElement = null;
        this._canvasesOuterElement = null;
        this._autoTileIdAttributeValue = -1;
        this._inactiveLayerOpacity = 1.0;
        this._appendedLayerCanvases = [];
        this._canvasMaxIds = 1;
        this._beforeAddLayerCallbackItem = null;
        this._afterResizedMapCallbackItem = null;
        this._selectedMapChipFragmentBoundarySize = { width: 1, height: 1 };
        this._documentMouseMoveEventCallee = null;
        this._documentMouseUpEventCallee = null;
        this._documentTouchMoveEventCallee = null;
        this._documentTouchEndEventCallee = null;
        this.gridCursorHidden = false;
        this.preventDefaultContextMenu = true;
        this.gridColor = '#000';
        this._projectId = -1;
        this._brushName = '';
        this._arrangementName = '';
        _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.Projects.setProjectAddCallbackFunction(() => this.setupProject());
        this._mapCanvas.setPickedCallback((picked => {
            this.dispatchEvent(new CustomEvent('mapchip-picked', {
                detail: { picked },
                bubbles: true,
                composed: true
            }));
        }));
    }
    get inactiveLayerOpacity() {
        return this._inactiveLayerOpacity;
    }
    set inactiveLayerOpacity(value) {
        const oldValue = this._inactiveLayerOpacity;
        this._inactiveLayerOpacity = value;
        this.setInactiveCanvasStyle();
        this.requestUpdate('inactiveLayerOpacity', oldValue);
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        const oldValue = this._projectId;
        this._projectId = value;
        this.setupProject();
        this.requestUpdate('projectId', oldValue);
    }
    get brush() {
        return this._brushName;
    }
    set brush(value) {
        const oldValue = this._brushName;
        this._brushName = value;
        this._mapCanvas.setBrushFromName(this._brushName);
        this.requestUpdate('brush', oldValue);
    }
    get arrangement() {
        return this._arrangementName;
    }
    set arrangement(value) {
        const oldValue = this._arrangementName;
        this._arrangementName = value;
        this._mapCanvas.setArrangementFromName(this._arrangementName);
        this.requestUpdate('arrangement', oldValue);
    }
    get autoTileId() {
        var _a;
        return ((_a = this._mapCanvas.selectedAutoTile) === null || _a === void 0 ? void 0 : _a.id) || -1;
    }
    set autoTileId(value) {
        var _a;
        const oldValue = value;
        const autoTile = (_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.autoTiles.fromId(value);
        this._autoTileIdAttributeValue = value;
        this.setActiveAutoTile(true);
        this.requestUpdate('autoTileId', oldValue);
    }
    get mapChipFragmentProperties() {
        var _a;
        return ((_a = this._mapCanvas.selectedMapChipFragments) === null || _a === void 0 ? void 0 : _a.map(mapChipFragment => mapChipFragment.toObject())) || null;
    }
    set mapChipFragmentProperties(values) {
        const oldValue = values;
        this.requestUpdate('mapChipFragmentProperties', oldValue);
        if (!values)
            return;
        const mapChipFragments = values.map(value => _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_4__.MapChipFragment.fromObject(value));
        this._mapCanvas.setMapChipFragments(mapChipFragments);
        this._selectedMapChipFragmentBoundarySize = this._mapCanvas.selectedMapChipFragmentBoundarySize;
    }
    get activeLayer() {
        return this._mapCanvas.activeLayer;
    }
    set activeLayer(value) {
        this._mapCanvas.setActiveLayer(value);
        this.setInactiveCanvasStyle();
    }
    get pickFromActiveLayer() {
        return this._mapCanvas.isPickFromActiveLayer;
    }
    set pickFromActiveLayer(value) {
        this._mapCanvas.isPickFromActiveLayer = value;
    }
    get width() {
        return this.xCount * this.gridWidth;
    }
    get height() {
        return this.yCount * this.gridHeight;
    }
    get xCount() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipCountX) || 0;
    }
    get yCount() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipCountY) || 0;
    }
    get gridWidth() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipWidth) || 0;
    }
    get gridHeight() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipHeight) || 0;
    }
    get mapCanvas() {
        return this._mapCanvas;
    }
    get isSubscribedProjectEvent() {
        return !!this._beforeAddLayerCallbackItem && !!this._afterResizedMapCallbackItem;
    }
    set mapCanvas(value) {
        this._mapCanvas = value;
    }
    setupProject() {
        if (this._project && this._project.projectId === this._projectId)
            return;
        if (this._project) {
            this._mapCanvas.unsubscribeProjectEvent();
            this._unsubscribeProjectEvent();
        }
        this._project = _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.Projects.fromProjectId(this._projectId);
        if (!this._project)
            return;
        this._mapCanvas.setProject(this._project);
        if (!this._mapCanvas.isSubscribedProjectEvent)
            this._mapCanvas.subscribeProjectEvent();
        if (!this.isSubscribedProjectEvent)
            this._subscribeProjectEvent();
        this._mapCanvas.firstRenderAll();
        this.setupMapCanvas();
        this.setActiveAutoTile();
        this.requestUpdate();
    }
    _subscribeProjectEvent() {
        if (!this._project || this.isSubscribedProjectEvent)
            return;
        this._beforeAddLayerCallbackItem = this._project.setCallback('beforeAddLayer', () => this._mapCanvas.addCanvas(this.addCanvasToDOMTree()));
        this._afterResizedMapCallbackItem = this._project.setCallback('afterResizedMap', () => {
            this.requestUpdate();
            this._appendedLayerCanvases.forEach(canvas => {
                canvas.width = this.width;
                canvas.height = this.height;
            });
            this._mapCanvas.renderAll();
        });
    }
    _unsubscribeProjectEvent() {
        if (!this._project)
            return;
        if (this._beforeAddLayerCallbackItem)
            this._project.removeCallback('beforeAddLayer', this._beforeAddLayerCallbackItem);
        if (this._afterResizedMapCallbackItem)
            this._project.removeCallback('afterResizedMap', this._afterResizedMapCallbackItem);
        this._beforeAddLayerCallbackItem = null;
        this._afterResizedMapCallbackItem = null;
    }
    createCanvas() {
        const canvas = document.createElement('canvas');
        this.setupCanvas(canvas);
        canvas.width = this.width;
        canvas.height = this.height;
        return canvas;
    }
    setupCanvas(canvas) {
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, this.width, this.height);
    }
    addCanvasToDOMTree() {
        if (!this._canvasesOuterElement)
            throw new Error();
        const canvas = this.createCanvas();
        canvas.id = `layer_canvas_${this._canvasMaxIds++}`;
        this._canvasesOuterElement.appendChild(canvas);
        this._appendedLayerCanvases.push(canvas);
        return canvas;
    }
    removeCanvasToDOMTree(index) {
        if (!this._canvasesOuterElement)
            throw new Error();
        const canvas = this._appendedLayerCanvases[index];
        this._canvasesOuterElement.removeChild(canvas);
        this._appendedLayerCanvases.splice(index, 1);
    }
    setActiveAutoTile(forced = false) {
        if (!this._project || this._autoTileIdAttributeValue < 0)
            return;
        if (!this._mapCanvas.hasActiveAutoTile() || forced) {
            const autoTile = this._project.tiledMap.autoTiles.fromId(this._autoTileIdAttributeValue);
            if (!autoTile)
                throw new Error(`AutoTile (id: ${this._autoTileIdAttributeValue}) is not found.`);
            this._mapCanvas.setAutoTile(autoTile);
        }
    }
    setupMapCanvas() {
        if (!this._project || !this._secondaryCanvasElement || !this._canvasesOuterElement)
            return;
        const diffCanvasCount = this._project.tiledMap.datas.length - this._appendedLayerCanvases.length;
        this._appendedLayerCanvases.forEach(canvas => this.setupCanvas(canvas));
        if (diffCanvasCount > 0) {
            for (let i = 0; i < diffCanvasCount; i++) {
                this.addCanvasToDOMTree();
            }
        }
        else if (diffCanvasCount < 0) {
            const layerCanvasesLength = this._appendedLayerCanvases.length;
            for (let i = layerCanvasesLength - 1; i >= layerCanvasesLength + diffCanvasCount; i--) {
                this.removeCanvasToDOMTree(i);
            }
        }
        this._mapCanvas.setCanvases(this._appendedLayerCanvases, this._secondaryCanvasElement);
    }
    setInactiveCanvasStyle() {
        if (!this._canvasesOuterElement)
            return;
        this._canvasesOuterElement.childNodes.forEach((node, index) => {
            const element = node;
            if (this.activeLayer === index) {
                element.style.opacity = '1.0';
            }
            else {
                element.style.opacity = this._inactiveLayerOpacity.toString();
            }
        });
    }
    firstUpdated() {
        var _a, _b, _c;
        const element = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('boundary');
        if (element)
            this.cursorPositionCalculator.setElement(element);
        this._secondaryCanvasElement = (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.getElementById('secondary-canvas');
        this._canvasesOuterElement = (_c = this.shadowRoot) === null || _c === void 0 ? void 0 : _c.getElementById('canvases');
        this.setupMapCanvas();
    }
    mouseDown(e) {
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        this._mapCanvas.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y, e.button === 2);
        this._documentMouseMoveEventCallee = e => this.mouseMove(e);
        this._documentMouseUpEventCallee = e => this.mouseUp(e);
        document.addEventListener('mousemove', this._documentMouseMoveEventCallee);
        document.addEventListener('mouseup', this._documentMouseUpEventCallee);
    }
    mouseMove(e) {
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        this._mapCanvas.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y);
    }
    mouseUp(e) {
        this._mapCanvas.mouseUp();
        if (this._documentMouseMoveEventCallee)
            document.removeEventListener('mousemove', this._documentMouseMoveEventCallee);
        if (this._documentMouseUpEventCallee)
            document.removeEventListener('mouseup', this._documentMouseUpEventCallee);
        this._documentMouseMoveEventCallee = null;
        this._documentMouseUpEventCallee = null;
    }
    touchStart(e) {
        if (e.touches.length > 1) {
            this._mapCanvas.reset();
            this._touchReset();
            return;
        }
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
        this._mapCanvas.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y, false);
        this._documentTouchMoveEventCallee = e => this.touchMove(e);
        this._documentTouchEndEventCallee = e => this.touchEnd(e);
        document.addEventListener('touchmove', this._documentTouchMoveEventCallee);
        document.addEventListener('touchend', this._documentTouchEndEventCallee);
    }
    touchMove(e) {
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.touches[0].clientX, e.touches[0].clientY);
        this._mapCanvas.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y);
    }
    touchEnd(e) {
        this._mapCanvas.mouseUp();
        this._touchReset();
    }
    _touchReset() {
        if (this._documentTouchMoveEventCallee)
            document.removeEventListener('touchmove', this._documentTouchMoveEventCallee);
        if (this._documentTouchEndEventCallee)
            document.removeEventListener('touchend', this._documentTouchEndEventCallee);
        this._documentTouchMoveEventCallee = null;
        this._documentTouchEndEventCallee = null;
    }
    render() {
        return lit__WEBPACK_IMPORTED_MODULE_0__.html `
      <style>
        #boundary {
          width: ${this.width + 1}px;
          height: ${this.height + 1}px;
        }
      </style>

      <div id="boundary"
        @mousedown="${(e) => this.mouseDown(e)}"
        @touchstart="${(e) => this.touchStart(e)}"
        @contextmenu="${(e) => this.preventDefaultContextMenu && e.preventDefault()}"
      >
        <div id="canvases"></div>
        <canvas
          id="secondary-canvas"
          width="${this.width}"
          height="${this.height}"
        ></canvas>
        ${this.gridCursorHidden ? null : lit__WEBPACK_IMPORTED_MODULE_0__.html `
          <map-grid-component
            gridWidth="${this.gridWidth}"
            gridHeight="${this.gridHeight}"
            chipCountX="${this.xCount}"
            chipCountY="${this.yCount}"
            gridColor="${this.gridColor}"
            cursorWidth="${this._selectedMapChipFragmentBoundarySize.width}"
            cursorHeight="${this._selectedMapChipFragmentBoundarySize.height}"
          ></map-grid-component>`}
      </div>
    `;
    }
    static get styles() {
        return lit__WEBPACK_IMPORTED_MODULE_0__.css `
      #canvases {
        position: relative;
      }

      #canvases > canvas {
        position: absolute;
        top: 0;
        left: 0;
      }

      #boundary {
        position: relative;
      }

      #secondary-canvas {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
      }
    `;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._mapCanvas.unsubscribeProjectEvent();
        this._unsubscribeProjectEvent();
    }
    connectedCallback() {
        super.connectedCallback();
        if (this._mapCanvas.hasProject && !this._mapCanvas.isSubscribedProjectEvent)
            this._mapCanvas.subscribeProjectEvent();
        if (this._project && !this.isSubscribedProjectEvent)
            this._subscribeProjectEvent();
    }
}
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], MapCanvasComponent.prototype, "gridCursorHidden", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], MapCanvasComponent.prototype, "preventDefaultContextMenu", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], MapCanvasComponent.prototype, "gridColor", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapCanvasComponent.prototype, "inactiveLayerOpacity", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapCanvasComponent.prototype, "projectId", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], MapCanvasComponent.prototype, "brush", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], MapCanvasComponent.prototype, "arrangement", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapCanvasComponent.prototype, "autoTileId", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Object })
], MapCanvasComponent.prototype, "mapChipFragmentProperties", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapCanvasComponent.prototype, "activeLayer", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], MapCanvasComponent.prototype, "pickFromActiveLayer", null);


/***/ }),

/***/ "../map-editor-components/dist/MapChipSelectorComponent.js":
/*!*****************************************************************!*\
  !*** ../map-editor-components/dist/MapChipSelectorComponent.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapChipSelectorComponent": () => (/* binding */ MapChipSelectorComponent)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "../../node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "../../node_modules/lit/decorators.js");
/* harmony import */ var _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @piyoppi/pico2map-editor */ "../map-editor/dist/main.js");
/* harmony import */ var _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Helpers/CursorPositionCalculator */ "../map-editor-components/dist/Helpers/CursorPositionCalculator.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




class MapChipSelectorComponent extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super(...arguments);
        this._gridImageSrc = '';
        this.gridImageGenerator = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_2__.GridImageGenerator();
        this.cursorPositionCalculator = new _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_3__.CursorPositionCalculator();
        this._project = null;
        this._mapChipSelector = null;
        this._imageSrc = '';
        this._afterReplacedMapChipImageCallbackItem = null;
        this._projectId = -1;
        this._chipId = -1;
        this.cursorChipX = 0;
        this.cursorChipY = 0;
        this.selectedX = 0;
        this.selectedY = 0;
        this.selectedWidth = 0;
        this.selectedHeight = 0;
    }
    get gridColor() {
        return this.gridImageGenerator.gridColor;
    }
    set gridColor(value) {
        const oldValue = this.gridImageGenerator.gridColor;
        this.gridImageGenerator.gridColor = value;
        this.requestUpdate('gridColor', oldValue);
    }
    get projectId() {
        return this._projectId;
    }
    set projectId(value) {
        const oldValue = this._projectId;
        this._projectId = value;
        this._setupProject();
        if (this._project) {
            this.setupMapChipSelector();
        }
        else {
            this.reset();
        }
        this.requestUpdate('projectId', oldValue);
    }
    get chipId() {
        return this._chipId;
    }
    set chipId(value) {
        const oldValue = this._chipId;
        this._chipId = value;
        this.setupMapChipSelector();
        this.requestUpdate('chipId', oldValue);
    }
    get mapChipSelector() {
        if (!this._mapChipSelector)
            throw new Error('The project is not set');
        return this._mapChipSelector;
    }
    get gridWidth() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipWidth) || 0;
    }
    get gridHeight() {
        var _a;
        return ((_a = this._project) === null || _a === void 0 ? void 0 : _a.tiledMap.chipHeight) || 0;
    }
    get cursorPosition() {
        return {
            x: this.cursorChipX * this.gridWidth,
            y: this.cursorChipY * this.gridHeight
        };
    }
    get subscribedProjectEvent() {
        return !!this._afterReplacedMapChipImageCallbackItem;
    }
    _setupProject() {
        if (this._project) {
            this._unsubscribeProjectEvent();
        }
        this._project = _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_2__.Projects.fromProjectId(this._projectId);
        if (!this._project)
            return;
        this._subscribeProjectEvent();
    }
    _subscribeProjectEvent() {
        if (!this._project || this._afterReplacedMapChipImageCallbackItem)
            return;
        this._afterReplacedMapChipImageCallbackItem = this._project.setCallback('afterReplacedMapChipImage', () => this.setupMapChipSelector());
    }
    _unsubscribeProjectEvent() {
        if (!this._project)
            return;
        if (this._afterReplacedMapChipImageCallbackItem)
            this._project.removeCallback('afterReplacedMapChipImage', this._afterReplacedMapChipImageCallbackItem);
        this._afterReplacedMapChipImageCallbackItem = null;
    }
    setupMapChipSelector() {
        if (!this._project)
            return;
        const chipImage = this._project.tiledMap.mapChipsCollection.findById(this._chipId);
        if (!chipImage) {
            this.reset();
            return;
        }
        this._mapChipSelector = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_2__.MapChipSelector(this._project.tiledMap, chipImage);
        this._imageSrc = this._mapChipSelector.chipImage.src;
        this.requestUpdate();
    }
    reset() {
        this._mapChipSelector = null;
        this._imageSrc = '';
    }
    mouseUp(e) {
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        this.mapChipSelector.mouseUp(mouseCursorPosition.x, mouseCursorPosition.y);
        const selectedChips = this.mapChipSelector.selectedChips;
        this.dispatchEvent(new CustomEvent('mapchip-selected', {
            detail: { selectedMapChipProperties: selectedChips.map(chip => chip.toObject()) },
            bubbles: true,
            composed: true
        }));
        this.syncSelectedCursor();
    }
    mouseMove(e) {
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        this.mapChipSelector.mouseMove(mouseCursorPosition.x, mouseCursorPosition.y);
        this.syncSelectedCursor();
        const chip = this.mapChipSelector.convertFromImagePositionToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y);
        this.cursorChipX = chip.x;
        this.cursorChipY = chip.y;
    }
    mouseDown(e) {
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        this.mapChipSelector.mouseDown(mouseCursorPosition.x, mouseCursorPosition.y);
        this.syncSelectedCursor();
    }
    syncSelectedCursor() {
        if (!this.mapChipSelector.selecting)
            return;
        const startPosition = this.mapChipSelector.startPosition;
        const selectedSize = this.mapChipSelector.selectedSize;
        this.selectedX = startPosition.x;
        this.selectedY = startPosition.y;
        this.selectedWidth = selectedSize.width;
        this.selectedHeight = selectedSize.height;
    }
    firstUpdated() {
        var _a;
        const element = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('boundary');
        if (element)
            this.cursorPositionCalculator.setElement(element);
    }
    render() {
        var _a, _b;
        this.gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight);
        if (this.gridImageGenerator.changed) {
            this._gridImageSrc = this.gridImageGenerator.generateLinePart().toDataURL();
        }
        return lit__WEBPACK_IMPORTED_MODULE_0__.html `
      <style>
        .grid {
          background-image: url("${this._gridImageSrc}");
          width: ${((_a = this._mapChipSelector) === null || _a === void 0 ? void 0 : _a.chipImage.image.width) || 0}px;
          height: ${((_b = this._mapChipSelector) === null || _b === void 0 ? void 0 : _b.chipImage.image.height) || 0}px;
        }

        .cursor {
          width: ${this.gridWidth}px;
          height: ${this.gridHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .selected {
          width: ${this.selectedWidth}px;
          height: ${this.selectedHeight}px;
          left: ${this.selectedX}px;
          top: ${this.selectedY}px;
        }
      </style>

      <div id="boundary">
        <img id="chip-image" src="${this._imageSrc}">
        <div
          class="grid-image grid"
          @mousemove="${(e) => this.mouseMove(e)}"
          @mousedown="${(e) => this.mouseDown(e)}"
          @mouseup="${(e) => this.mouseUp(e)}"
        ></div>
        ${this._imageSrc ? lit__WEBPACK_IMPORTED_MODULE_0__.html `<div class="cursor"></div>` : null}
        ${(this._imageSrc && this.selectedWidth > 0 && this.selectedHeight > 0) ? lit__WEBPACK_IMPORTED_MODULE_0__.html `<div class="selected"></div>` : null}
      </div>
    `;
    }
    static get styles() {
        return lit__WEBPACK_IMPORTED_MODULE_0__.css `
      .grid-image {
        position: absolute;
        top: 0;
        left: 0;
        background-repeat: repeat;
      }

      .cursor, .selected {
        position: absolute;
        border-style: solid;
        box-sizing: border-box;
      }

      .cursor {
        border-color: red;
        pointer-events: none;
      }

      .selected {
        border-color: blue;
        pointer-events: none;
      }

      #boundary {
        position: relative;
      }

      #chip-image {
        display: block;
        user-select: none;
      }
    `;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribeProjectEvent();
    }
    connectedCallback() {
        super.connectedCallback();
        this._subscribeProjectEvent();
    }
}
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], MapChipSelectorComponent.prototype, "gridColor", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "projectId", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "chipId", null);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "cursorChipX", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "cursorChipY", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "selectedX", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "selectedY", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "selectedWidth", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapChipSelectorComponent.prototype, "selectedHeight", void 0);


/***/ }),

/***/ "../map-editor-components/dist/MapGridComponent.js":
/*!*********************************************************!*\
  !*** ../map-editor-components/dist/MapGridComponent.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapGridComponent": () => (/* binding */ MapGridComponent)
/* harmony export */ });
/* harmony import */ var lit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lit */ "../../node_modules/lit/index.js");
/* harmony import */ var lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lit/decorators.js */ "../../node_modules/lit/decorators.js");
/* harmony import */ var _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Helpers/CursorPositionCalculator */ "../map-editor-components/dist/Helpers/CursorPositionCalculator.js");
/* harmony import */ var _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @piyoppi/pico2map-editor */ "../map-editor/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




class MapGridComponent extends lit__WEBPACK_IMPORTED_MODULE_0__.LitElement {
    constructor() {
        super(...arguments);
        this.gridImageSrc = '';
        this.gridImageGenerator = new _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.GridImageGenerator();
        this.cursorPositionCalculator = new _Helpers_CursorPositionCalculator__WEBPACK_IMPORTED_MODULE_2__.CursorPositionCalculator();
        this.mapMouseDownPosition = { x: -1, y: -1 };
        this.lastCursor = { x: -1, y: -1 };
        this.isMouseDown = false;
        this.mouseUpEventCallee = null;
        this.gridWidth = 0;
        this.gridHeight = 0;
        this.chipCountX = 0;
        this.chipCountY = 0;
        this.cursorHidden = false;
        this.cursorX = 0;
        this.cursorY = 0;
        this.cursorWidth = 1;
        this.cursorHeight = 1;
    }
    get gridColor() {
        return this.gridImageGenerator.gridColor;
    }
    set gridColor(value) {
        const oldValue = this.gridImageGenerator.gridColor;
        this.gridImageGenerator.gridColor = value;
        this.requestUpdate('gridColor', oldValue);
    }
    get width() {
        return this.chipCountX * this.gridWidth;
    }
    get height() {
        return this.chipCountY * this.gridHeight;
    }
    get cursorPosition() {
        return {
            x: this.cursorX * this.gridWidth,
            y: this.cursorY * this.gridHeight
        };
    }
    firstUpdated() {
        var _a;
        const element = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.getElementById('boundary');
        if (element)
            this.cursorPositionCalculator.setElement(element);
    }
    mouseDown(e) {
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        const cursor = this.convertFromCursorPositionToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y);
        this.mapMouseDownPosition = this.lastCursor = cursor;
        this.isMouseDown = true;
        this.mouseUpEventCallee = () => this.mouseUp();
        document.addEventListener('mouseup', this.mouseUpEventCallee);
    }
    mouseMove(e) {
        if (this.cursorHidden)
            return;
        const mouseCursorPosition = this.cursorPositionCalculator.getMouseCursorPosition(e.pageX, e.pageY);
        let cursor = this.convertFromCursorPositionToChipPosition(mouseCursorPosition.x, mouseCursorPosition.y);
        if (this.isMouseDown) {
            cursor = (0,_piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.convertChipPositionDivisionByCursorSize)(cursor.x, cursor.y, this.mapMouseDownPosition.x, this.mapMouseDownPosition.y, this.cursorWidth, this.cursorHeight);
        }
        if (cursor.x === this.lastCursor.x && cursor.y === this.lastCursor.y)
            return;
        this.lastCursor = cursor;
        this.cursorX = cursor.x;
        this.cursorY = cursor.y;
    }
    mouseUp() {
        this.isMouseDown = false;
        if (this.mouseUpEventCallee)
            document.removeEventListener('mouseup', this.mouseUpEventCallee);
        this.mouseUpEventCallee = null;
    }
    convertFromCursorPositionToChipPosition(x, y) {
        return (0,_piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_3__.convertFromCursorPositionToChipPosition)(x, y, this.gridWidth, this.gridHeight, this.chipCountX, this.chipCountY, this.cursorWidth, this.cursorHeight);
    }
    render() {
        this.gridImageGenerator.setGridSize(this.gridWidth, this.gridHeight);
        if (this.gridImageGenerator.changed) {
            this.gridImageSrc = this.gridImageGenerator.generateLinePart().toDataURL();
        }
        return lit__WEBPACK_IMPORTED_MODULE_0__.html `
      <style>
        .grid {
          background-image: url("${this.gridImageSrc}");
        }

        #boundary {
          width: ${this.width + 1}px;
          height: ${this.height + 1}px;
        }

        .cursor {
          width: ${this.gridWidth * this.cursorWidth}px;
          height: ${this.gridHeight * this.cursorHeight}px;
          left: ${this.cursorPosition.x}px;
          top: ${this.cursorPosition.y}px;
        }

        .grid-image {
          background-position: 1px 1px
        }
      </style>

      <div id="boundary">
        <div
          class="grid-image grid"
          @mousedown="${(e) => this.mouseDown(e)}"
          @mousemove="${(e) => this.mouseMove(e)}"
        ></div>
        ${!this.cursorHidden ? lit__WEBPACK_IMPORTED_MODULE_0__.html `<div class="cursor"></div>` : null}
      </div>
    `;
    }
    static get styles() {
        return lit__WEBPACK_IMPORTED_MODULE_0__.css `
      .grid-image {
        position: absolute;
        top: 0;
        left: 0;
        background-repeat: repeat;
        width: 100%;
        height: 100%;
      }

      #boundary {
        position: relative;
      }

      .cursor {
        position: absolute;
        border-style: solid;
        box-sizing: border-box;
        border-color: red;
        pointer-events: none;
      }
    `;
    }
}
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "gridWidth", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "gridHeight", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "chipCountX", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "chipCountY", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Boolean })
], MapGridComponent.prototype, "cursorHidden", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "cursorX", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "cursorY", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "cursorWidth", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: Number })
], MapGridComponent.prototype, "cursorHeight", void 0);
__decorate([
    (0,lit_decorators_js__WEBPACK_IMPORTED_MODULE_1__.property)({ type: String })
], MapGridComponent.prototype, "gridColor", null);


/***/ }),

/***/ "../map-editor-components/dist/PickedArrangementSelector.js":
/*!******************************************************************!*\
  !*** ../map-editor-components/dist/PickedArrangementSelector.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PickedArrangementSelector": () => (/* binding */ PickedArrangementSelector)
/* harmony export */ });
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

function PickedArrangementSelector(detail) {
    if ((0,_piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.isAutoTileMapChip)(detail.picked)) {
        return 'AutoTileArrangement';
    }
    else if (detail.picked) {
        return 'DefaultArrangement';
    }
    else {
        return 'DefaultEraseArrangement';
    }
}


/***/ }),

/***/ "../map-editor-components/dist/main.js":
/*!*********************************************!*\
  !*** ../map-editor-components/dist/main.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "defineComponent": () => (/* binding */ defineComponent),
/* harmony export */   "Projects": () => (/* reexport safe */ _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_5__.Projects),
/* harmony export */   "MapChipSelectedEvent": () => (/* reexport safe */ _Events__WEBPACK_IMPORTED_MODULE_6__.MapChipSelectedEvent),
/* harmony export */   "AutoTileSelectedEvent": () => (/* reexport safe */ _Events__WEBPACK_IMPORTED_MODULE_6__.AutoTileSelectedEvent),
/* harmony export */   "PickedMapChipEvent": () => (/* reexport safe */ _Events__WEBPACK_IMPORTED_MODULE_6__.PickedMapChipEvent),
/* harmony export */   "PickedArrangementSelector": () => (/* reexport safe */ _PickedArrangementSelector__WEBPACK_IMPORTED_MODULE_7__.PickedArrangementSelector)
/* harmony export */ });
/* harmony import */ var _MapChipSelectorComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MapChipSelectorComponent */ "../map-editor-components/dist/MapChipSelectorComponent.js");
/* harmony import */ var _MapCanvasComponent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MapCanvasComponent */ "../map-editor-components/dist/MapCanvasComponent.js");
/* harmony import */ var _AutoTileSelectorComponent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AutoTileSelectorComponent */ "../map-editor-components/dist/AutoTileSelectorComponent.js");
/* harmony import */ var _ColisionMarkerComponent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ColisionMarkerComponent */ "../map-editor-components/dist/ColisionMarkerComponent.js");
/* harmony import */ var _MapGridComponent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MapGridComponent */ "../map-editor-components/dist/MapGridComponent.js");
/* harmony import */ var _piyoppi_pico2map_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @piyoppi/pico2map-editor */ "../map-editor/dist/main.js");
/* harmony import */ var _Events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Events */ "../map-editor-components/dist/Events.js");
/* harmony import */ var _PickedArrangementSelector__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PickedArrangementSelector */ "../map-editor-components/dist/PickedArrangementSelector.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */





function defineComponent() {
    customElements.define('map-canvas-component', _MapCanvasComponent__WEBPACK_IMPORTED_MODULE_1__.MapCanvasComponent);
    customElements.define('auto-tile-selector-component', _AutoTileSelectorComponent__WEBPACK_IMPORTED_MODULE_2__.AutoTileSelectorComponent);
    customElements.define('map-chip-selector-component', _MapChipSelectorComponent__WEBPACK_IMPORTED_MODULE_0__.MapChipSelectorComponent);
    customElements.define('colider-marker-component', _ColisionMarkerComponent__WEBPACK_IMPORTED_MODULE_3__.ColiderMarkerComponent);
    customElements.define('map-grid-component', _MapGridComponent__WEBPACK_IMPORTED_MODULE_4__.MapGridComponent);
}





/***/ }),

/***/ "../map-editor/dist/AutoTileSelector.js":
/*!**********************************************!*\
  !*** ../map-editor/dist/AutoTileSelector.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoTileSelector": () => (/* binding */ AutoTileSelector)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class AutoTileSelector {
    constructor(_canvasWidth, _chipWidth, _chipHeight, _autoTiles, _mapChipsCollection) {
        this._canvasWidth = _canvasWidth;
        this._chipWidth = _chipWidth;
        this._chipHeight = _chipHeight;
        this._autoTiles = _autoTiles;
        this._mapChipsCollection = _mapChipsCollection;
        this._indexImageWidth = 0;
        this._indexImageHeight = 0;
        this._autoTilesMap = new Map();
    }
    get canvasWidth() {
        return this._canvasWidth;
    }
    set canvasWidth(value) {
        this._canvasWidth = value;
    }
    getAutoTileFragmentFromIndexImagePosition(cursorX, cursorY) {
        const x = Math.floor(cursorX / this._chipWidth);
        const y = Math.floor(cursorY / this._chipHeight);
        return this._autoTilesMap.get(`${x},${y}`) || null;
    }
    convertFromIndexImageToChipPosition(cursorX, cursorY) {
        const chipCount = {
            width: this._indexImageWidth / this._chipWidth,
            height: this._indexImageHeight / this._chipHeight
        };
        return {
            x: Math.max(0, Math.min(Math.floor(cursorX / this._chipWidth), chipCount.width - 1)),
            y: Math.max(0, Math.min(Math.floor(cursorY / this._chipHeight), chipCount.height - 1))
        };
    }
    getSizeOfIndexImage() {
        return {
            width: this._canvasWidth,
            height: Math.ceil(this._autoTiles.length / Math.floor(this._canvasWidth / this._chipWidth)) * this._chipHeight
        };
    }
    generateIndexImage(canvas) {
        const indexImageContext = canvas.getContext('2d');
        if (!indexImageContext)
            return;
        indexImageContext.clearRect(0, 0, canvas.width, canvas.height);
        this._autoTilesMap.clear();
        const xCount = Math.floor(this._canvasWidth / this._chipWidth);
        const values = this._autoTiles.values();
        let currentAutoTile = undefined;
        let x = 0, y = 0;
        while (currentAutoTile = values.next().value) {
            const fragment = currentAutoTile.mapChipFragments[0];
            const chipImage = this._mapChipsCollection.findById(fragment.chipId);
            if (!chipImage)
                continue;
            indexImageContext.drawImage(chipImage.image, fragment.x * this._chipWidth, fragment.y * this._chipHeight, this._chipWidth, this._chipHeight, x * this._chipWidth, y * this._chipHeight, this._chipWidth, this._chipHeight);
            this._autoTilesMap.set(`${x},${y}`, currentAutoTile);
            x++;
            if (x >= xCount) {
                x = 0;
                y++;
            }
        }
        this._indexImageWidth = xCount * this._chipWidth;
        this._indexImageHeight = (y + 1) * this._chipHeight;
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/Arrangement.js":
/*!**************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/Arrangement.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isMapChipFragmentRequired": () => (/* binding */ isMapChipFragmentRequired),
/* harmony export */   "isTiledMapDataRequired": () => (/* binding */ isTiledMapDataRequired),
/* harmony export */   "isAutoTileRequired": () => (/* binding */ isAutoTileRequired),
/* harmony export */   "isAutoTilesRequired": () => (/* binding */ isAutoTilesRequired),
/* harmony export */   "isColiderTypesRequired": () => (/* binding */ isColiderTypesRequired)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
function isMapChipFragmentRequired(obj) {
    return typeof obj.setMapChips === 'function';
}
function isTiledMapDataRequired(obj) {
    return typeof obj.setTiledMapData === 'function';
}
function isAutoTileRequired(obj) {
    return typeof obj.setAutoTile === 'function';
}
function isAutoTilesRequired(obj) {
    return typeof obj.setAutoTiles === 'function';
}
function isColiderTypesRequired(obj) {
    return typeof obj.setColiderTypes === 'function';
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/Arrangements.js":
/*!***************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/Arrangements.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Arrangements": () => (/* binding */ Arrangements)
/* harmony export */ });
/* harmony import */ var _DefaultArrangement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DefaultArrangement */ "../map-editor/dist/Brushes/Arrangements/DefaultArrangement.js");
/* harmony import */ var _AutoTileArrangement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AutoTileArrangement */ "../map-editor/dist/Brushes/Arrangements/AutoTileArrangement.js");
/* harmony import */ var _DefaultEraseArrangement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DefaultEraseArrangement */ "../map-editor/dist/Brushes/Arrangements/DefaultEraseArrangement.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */



const registeredArrangementDescriptions = [
    _DefaultArrangement__WEBPACK_IMPORTED_MODULE_0__.DefaultArrangementDescription,
    _AutoTileArrangement__WEBPACK_IMPORTED_MODULE_1__.AutoTileArrangementDescription,
    _DefaultEraseArrangement__WEBPACK_IMPORTED_MODULE_2__.DefaultEraseArrangementDescription
];
const Arrangements = registeredArrangementDescriptions.map(description => ({
    name: description.name,
    create: () => description.create()
}));


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/AutoTileArrangement.js":
/*!**********************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/AutoTileArrangement.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoTileArrangementDescription": () => (/* binding */ AutoTileArrangementDescription),
/* harmony export */   "AutoTileArrangement": () => (/* binding */ AutoTileArrangement)
/* harmony export */ });
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

const AutoTileArrangementDescription = {
    name: 'AutoTileArrangement',
    create: () => new AutoTileArrangement()
};
/**
 * AutoTileArrangement
 *
 * Supported auto tile format is shown below.
 *
 * |<---------- 1chip ----------->|
 * ┏━┿┿┿┿┿┿┿┿┓---
 * ┠isolated                   ┠↑
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠straight road (lengthwise) ┠ |
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠straight road (sideways)   ┠5chips
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠cross road                 ┠ |
 * ┣┿┿┿┿┿┿┿┿┿┫ |
 * ┠square                     ┠↓
 * ┗┷┿┿┿┿┿┿┿┿┛---
 */
class AutoTileArrangement {
    constructor() {
        this._autoTile = null;
        this._tiledMapData = null;
        this.temporaryChip = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.AutoTileMapChip(-1, [new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment(-1, -1, -1)]);
    }
    get tiledMapData() {
        return this._tiledMapData;
    }
    setMapChips(mapChips) {
    }
    setAutoTile(autoTile) {
        if (autoTile.mapChipFragments.length !== 5)
            throw new Error('Too few map chips. AutoTileArrangement requires 5 map chips.');
        this._autoTile = autoTile;
    }
    setTiledMapData(tiledMapData) {
        this._tiledMapData = tiledMapData;
    }
    apply(paints) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (!this._tiledMapData)
            throw new Error('MapData is not set.');
        const result = [];
        const x1 = paints.reduce((acc, val) => Math.min(acc, val.x), this._tiledMapData.width);
        const y1 = paints.reduce((acc, val) => Math.min(acc, val.y), this._tiledMapData.height);
        const x2 = paints.reduce((acc, val) => Math.max(acc, val.x), 0);
        const y2 = paints.reduce((acc, val) => Math.max(acc, val.y), 0);
        const size = {
            width: x2 - x1 + 1,
            height: y2 - y1 + 1
        };
        const sizeWithPatch = {
            width: size.width + 2,
            height: size.height + 2
        };
        const tiledBuffer = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.TiledMapData(sizeWithPatch.width, sizeWithPatch.height);
        const offsetX1 = 1;
        const offsetY1 = 1;
        const offsetX2 = 1;
        const offsetY2 = 1;
        tiledBuffer.transferFromTiledMapData(this._tiledMapData, x1 - offsetX1, y1 - offsetY1, sizeWithPatch.width + offsetX2, sizeWithPatch.height + offsetY2, 0, 0);
        paints.forEach(paint => {
            const x = paint.x - x1 + offsetX1;
            const y = paint.y - y1 + offsetY1;
            tiledBuffer.put(this.temporaryChip, x, y);
        });
        for (let y = offsetY1; y < size.height + offsetY2; y++) {
            for (let x = offsetX1; x < size.width + offsetX2; x++) {
                const cursor = tiledBuffer.getFromChipPosition(x, y);
                const targetChip = tiledBuffer.getFromChipPosition(x, y);
                const isTemporaryChip = targetChip ? this.temporaryChip.compare(targetChip) : false;
                if (!cursor)
                    continue;
                if (!isTemporaryChip)
                    continue;
                /**
                 * adjacent
                 *
                 *  x      : processing point
                 *  others : patch number
                 * *-----*-----*-----*
                 * | 16  |  1  | 32  |
                 * *-----*-----*-----*
                 * |  2  |  x  |  4  |
                 * *-----*-----*-----*
                 * | 64  |  8  | 128 |
                 * *-----*-----*-----*
                 */
                let adjacent = 0;
                const aroundChips = [
                    tiledBuffer.getFromChipPosition(x, y - 1),
                    tiledBuffer.getFromChipPosition(x - 1, y),
                    tiledBuffer.getFromChipPosition(x + 1, y),
                    tiledBuffer.getFromChipPosition(x, y + 1),
                    tiledBuffer.getFromChipPosition(x - 1, y - 1),
                    tiledBuffer.getFromChipPosition(x + 1, y - 1),
                    tiledBuffer.getFromChipPosition(x - 1, y + 1),
                    tiledBuffer.getFromChipPosition(x + 1, y + 1)
                ].map(mapChip => (0,_piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.isAutoTileMapChip)(mapChip) ? mapChip : null);
                if (!((_a = aroundChips[0]) === null || _a === void 0 ? void 0 : _a.boundary.bottom))
                    adjacent += this._isAdjacent(aroundChips[0]) ? 1 : 0;
                if (!((_b = aroundChips[1]) === null || _b === void 0 ? void 0 : _b.boundary.right))
                    adjacent += this._isAdjacent(aroundChips[1]) ? 2 : 0;
                if (!((_c = aroundChips[2]) === null || _c === void 0 ? void 0 : _c.boundary.left))
                    adjacent += this._isAdjacent(aroundChips[2]) ? 4 : 0;
                if (!((_d = aroundChips[3]) === null || _d === void 0 ? void 0 : _d.boundary.top))
                    adjacent += this._isAdjacent(aroundChips[3]) ? 8 : 0;
                if (!((_e = aroundChips[4]) === null || _e === void 0 ? void 0 : _e.boundary.bottom) && !((_f = aroundChips[4]) === null || _f === void 0 ? void 0 : _f.boundary.right) && !((_g = aroundChips[4]) === null || _g === void 0 ? void 0 : _g.cross.bottomRight))
                    adjacent += this._isAdjacent(aroundChips[4]) ? 16 : 0;
                if (!((_h = aroundChips[5]) === null || _h === void 0 ? void 0 : _h.boundary.bottom) && !((_j = aroundChips[5]) === null || _j === void 0 ? void 0 : _j.boundary.left) && !((_k = aroundChips[5]) === null || _k === void 0 ? void 0 : _k.cross.bottomLeft))
                    adjacent += this._isAdjacent(aroundChips[5]) ? 32 : 0;
                if (!((_l = aroundChips[6]) === null || _l === void 0 ? void 0 : _l.boundary.top) && !((_m = aroundChips[6]) === null || _m === void 0 ? void 0 : _m.boundary.right) && !((_o = aroundChips[6]) === null || _o === void 0 ? void 0 : _o.cross.topRight))
                    adjacent += this._isAdjacent(aroundChips[6]) ? 64 : 0;
                if (!((_p = aroundChips[7]) === null || _p === void 0 ? void 0 : _p.boundary.top) && !((_q = aroundChips[7]) === null || _q === void 0 ? void 0 : _q.boundary.left) && !((_r = aroundChips[7]) === null || _r === void 0 ? void 0 : _r.cross.topLeft))
                    adjacent += this._isAdjacent(aroundChips[7]) ? 128 : 0;
                const item = this.getTiledPattern(adjacent, aroundChips);
                if (item) {
                    tiledBuffer.put(item, x, y);
                    result.push({ x: x + x1 - offsetX1, y: y + y1 - offsetY1, item });
                }
            }
        }
        return result;
    }
    getTiledPattern(adjacent, aroundChips) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!this._autoTile)
            return null;
        const mapChip = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.AutoTileMapChip(this._autoTile.id, [], 'AutoTileArrangement');
        const mapChips = this._autoTile.mapChipFragments;
        const boundary = {
            top: false,
            bottom: false,
            left: false,
            right: false
        };
        const cross = {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        };
        if ((adjacent & 19) === 19 && !((_a = aroundChips[0]) === null || _a === void 0 ? void 0 : _a.cross.bottomLeft) && !((_b = aroundChips[1]) === null || _b === void 0 ? void 0 : _b.cross.topRight)) {
            /* Square */
            mapChip.push(mapChips[4].clone().withParameter({ renderingArea: 1 }));
            boundary.top = false;
            boundary.left = false;
        }
        else if ((adjacent & 3) === 2) {
            /* Straight(sideways) */
            mapChip.push(mapChips[2].clone().withParameter({ renderingArea: 1 }));
            boundary.top = true;
            boundary.left = false;
        }
        else if ((adjacent & 3) === 1) {
            /* Straight(lengthwise) */
            mapChip.push(mapChips[1].clone().withParameter({ renderingArea: 1 }));
            boundary.top = false;
            boundary.left = true;
        }
        else if ((adjacent & 3) === 0) {
            /* Corner */
            mapChip.push(mapChips[0].clone().withParameter({ renderingArea: 1 }));
            boundary.top = true;
            boundary.left = true;
        }
        else if ((adjacent & 19) === 3) {
            /* Cross */
            mapChip.push(mapChips[3].clone().withParameter({ renderingArea: 1 }));
            boundary.top = false;
            boundary.left = false;
            cross.topLeft = true;
        }
        if ((adjacent & 37) === 37 && !((_c = aroundChips[0]) === null || _c === void 0 ? void 0 : _c.cross.bottomRight) && !((_d = aroundChips[2]) === null || _d === void 0 ? void 0 : _d.cross.topLeft)) {
            mapChip.push(mapChips[4].clone().withParameter({ renderingArea: 2 }));
        }
        else if ((adjacent & 5) === 4) {
            mapChip.push(mapChips[2].clone().withParameter({ renderingArea: 2 }));
        }
        else if ((adjacent & 5) === 1) {
            mapChip.push(mapChips[1].clone().withParameter({ renderingArea: 2 }));
        }
        else if ((adjacent & 5) === 0) {
            mapChip.push(mapChips[0].clone().withParameter({ renderingArea: 2 }));
        }
        else if ((adjacent & 37) === 5) {
            mapChip.push(mapChips[3].clone().withParameter({ renderingArea: 2 }));
            cross.topRight = true;
        }
        if ((adjacent & 74) === 74 && !((_e = aroundChips[1]) === null || _e === void 0 ? void 0 : _e.cross.bottomRight) && !((_f = aroundChips[3]) === null || _f === void 0 ? void 0 : _f.cross.topRight)) {
            mapChip.push(mapChips[4].clone().withParameter({ renderingArea: 4 }));
        }
        else if ((adjacent & 10) === 2) {
            mapChip.push(mapChips[2].clone().withParameter({ renderingArea: 4 }));
        }
        else if ((adjacent & 10) === 8) {
            mapChip.push(mapChips[1].clone().withParameter({ renderingArea: 4 }));
        }
        else if ((adjacent & 10) === 0) {
            mapChip.push(mapChips[0].clone().withParameter({ renderingArea: 4 }));
        }
        else if ((adjacent & 74) === 10) {
            mapChip.push(mapChips[3].clone().withParameter({ renderingArea: 4 }));
            cross.bottomLeft = true;
        }
        if ((adjacent & 140) === 140 && !((_g = aroundChips[2]) === null || _g === void 0 ? void 0 : _g.cross.bottomLeft) && !((_h = aroundChips[3]) === null || _h === void 0 ? void 0 : _h.cross.topRight)) {
            mapChip.push(mapChips[4].clone().withParameter({ renderingArea: 8 }));
            boundary.bottom = false;
            boundary.right = false;
        }
        else if ((adjacent & 12) === 4) {
            mapChip.push(mapChips[2].clone().withParameter({ renderingArea: 8 }));
            boundary.bottom = true;
            boundary.right = false;
        }
        else if ((adjacent & 12) === 8) {
            mapChip.push(mapChips[1].clone().withParameter({ renderingArea: 8 }));
            boundary.bottom = false;
            boundary.right = true;
        }
        else if ((adjacent & 12) === 0) {
            mapChip.push(mapChips[0].clone().withParameter({ renderingArea: 8 }));
            boundary.bottom = true;
            boundary.right = true;
        }
        else if ((adjacent & 140) === 12) {
            mapChip.push(mapChips[3].clone().withParameter({ renderingArea: 8 }));
            boundary.bottom = false;
            boundary.right = false;
            cross.bottomRight = true;
        }
        if (mapChip.length !== 4)
            return null;
        mapChip.setBoundary(boundary);
        mapChip.setCross(cross);
        return mapChip;
    }
    _isAdjacent(chip) {
        if (chip === null)
            return false;
        const isTemporaryChip = this.temporaryChip.compare(chip);
        const isAutoTileChip = this._isAutoTileChip(chip);
        return isAutoTileChip || isTemporaryChip;
    }
    _isAutoTileChip(chip) {
        if (!this._autoTile)
            return false;
        if (!chip)
            return false;
        return this._autoTile.id === chip.autoTileId;
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/AutoTileEraseArrangement.js":
/*!***************************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/AutoTileEraseArrangement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoTileEraseArrangementDescription": () => (/* binding */ AutoTileEraseArrangementDescription),
/* harmony export */   "AutoTileEraseArrangement": () => (/* binding */ AutoTileEraseArrangement)
/* harmony export */ });
/* harmony import */ var _AutoTileArrangement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AutoTileArrangement */ "../map-editor/dist/Brushes/Arrangements/AutoTileArrangement.js");
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */


const AutoTileEraseArrangementDescription = {
    name: 'AutoTileEraseArrangement',
    create: () => new AutoTileEraseArrangement()
};
class AutoTileEraseArrangement {
    constructor() {
        this._autoTileArrangement = new _AutoTileArrangement__WEBPACK_IMPORTED_MODULE_0__.AutoTileArrangement();
        this._tiledMapData = null;
        this._autoTiles = null;
    }
    setTiledMapData(tiledMapData) {
        this._tiledMapData = tiledMapData;
    }
    setAutoTiles(autoTiles) {
        this._autoTiles = autoTiles;
    }
    apply(paints) {
        if (paints.length === 0)
            return [];
        return this.erase(paints);
    }
    erase(paints) {
        if (!this._tiledMapData)
            throw new Error('MapData is not set.');
        if (!this._autoTiles)
            throw new Error('AutoTiles is not set');
        const resultPaints = [];
        const paintX1 = paints.reduce((acc, val) => Math.min(acc, val.x), this._tiledMapData.width);
        const paintY1 = paints.reduce((acc, val) => Math.min(acc, val.y), this._tiledMapData.height);
        const paintX2 = paints.reduce((acc, val) => Math.max(acc, val.x), 0);
        const paintY2 = paints.reduce((acc, val) => Math.max(acc, val.y), 0);
        const x1 = Math.max(paintX1 - 1, 0);
        const y1 = Math.max(paintY1 - 1, 0);
        const x2 = Math.min(paintX2 + 1, this._tiledMapData.width);
        const y2 = Math.min(paintY2 + 1, this._tiledMapData.height);
        const bufferWidth = x2 - x1 + 1;
        const bufferHeight = y2 - y1 + 1;
        const tiledBuffer = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__.TiledMapData(bufferWidth + 2, bufferHeight + 2);
        const bufferOffsetX = x1 - 1;
        const bufferOffsetY = y1 - 1;
        tiledBuffer.transferFromTiledMapData(this._tiledMapData, bufferOffsetX, bufferOffsetY, tiledBuffer.width, tiledBuffer.height, 0, 0);
        paints.forEach(paint => {
            var _a;
            const paintPositionAtBuffer = { x: paint.x - bufferOffsetX, y: paint.y - bufferOffsetY };
            tiledBuffer.put(null, paintPositionAtBuffer.x, paintPositionAtBuffer.y);
            resultPaints.push({ x: paint.x, y: paint.y, item: null });
            this._autoTileArrangement.setTiledMapData(tiledBuffer);
            for (let y = paintPositionAtBuffer.y - 1; y <= paintPositionAtBuffer.y + 1; y++) {
                for (let x = paintPositionAtBuffer.x - 1; x <= paintPositionAtBuffer.x + 1; x++) {
                    if (x === paintPositionAtBuffer.x && y === paintPositionAtBuffer.y)
                        continue;
                    const item = tiledBuffer.getFromChipPosition(x, y);
                    if (item && (0,_piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__.isAutoTileMapChip)(item)) {
                        const autoTile = (_a = this._autoTiles) === null || _a === void 0 ? void 0 : _a.fromId(item.autoTileId);
                        if (!autoTile)
                            continue;
                        this._autoTileArrangement.setAutoTile(autoTile);
                        const appliedPaints = this._autoTileArrangement.apply([{ x, y }]);
                        if (appliedPaints.length === 0)
                            continue;
                        resultPaints.push({ x: appliedPaints[0].x + bufferOffsetX, y: appliedPaints[0].y + bufferOffsetY, item: appliedPaints[0].item });
                    }
                }
            }
        });
        return resultPaints;
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/ColiderArrangement.js":
/*!*********************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/ColiderArrangement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColiderArrangementDescription": () => (/* binding */ ColiderArrangementDescription),
/* harmony export */   "ColiderArrangement": () => (/* binding */ ColiderArrangement)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
const ColiderArrangementDescription = {
    name: 'ColiderArrangement',
    create: () => new ColiderArrangement()
};
class ColiderArrangement {
    constructor() {
        this._coliderType = 0;
    }
    setColiderTypes(coliderType) {
        this._coliderType = coliderType;
    }
    apply(paints) {
        return paints.map(paint => ({ ...paint, item: this._coliderType }));
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/DefaultArrangement.js":
/*!*********************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/DefaultArrangement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultArrangementDescription": () => (/* binding */ DefaultArrangementDescription),
/* harmony export */   "DefaultArrangement": () => (/* binding */ DefaultArrangement)
/* harmony export */ });
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

const DefaultArrangementDescription = {
    name: 'DefaultArrangement',
    create: () => new DefaultArrangement()
};
class DefaultArrangement {
    constructor() {
        this._mapChips = [];
    }
    setMapChips(mapChips) {
        if (mapChips.length < 1)
            throw new Error('Invalid count of map chips. DefaultArrangement requires a map chip.');
        this._mapChips = mapChips;
    }
    apply(paints) {
        if (this._mapChips.length < 1)
            throw new Error('Invalid count of map chips. DefaultArrangement requires a map chip.');
        const basePosition = { x: this._mapChips[0].x, y: this._mapChips[0].y };
        return paints.map(paint => {
            return this._mapChips.map(mapChip => ({
                x: paint.x + mapChip.x - basePosition.x,
                y: paint.y + mapChip.y - basePosition.y,
                item: new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.MapChip([mapChip])
            }));
        }).flat(1);
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/DefaultEraseArrangement.js":
/*!**************************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/DefaultEraseArrangement.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultEraseArrangementDescription": () => (/* binding */ DefaultEraseArrangementDescription),
/* harmony export */   "DefaultEraseArrangement": () => (/* binding */ DefaultEraseArrangement)
/* harmony export */ });
/* harmony import */ var _EraseArrangement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EraseArrangement */ "../map-editor/dist/Brushes/Arrangements/EraseArrangement.js");
/* harmony import */ var _AutoTileEraseArrangement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AutoTileEraseArrangement */ "../map-editor/dist/Brushes/Arrangements/AutoTileEraseArrangement.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */


const DefaultEraseArrangementDescription = {
    name: 'DefaultEraseArrangement',
    create: () => new DefaultEraseArrangement()
};
class DefaultEraseArrangement {
    constructor() {
        this.defaultEraser = new _EraseArrangement__WEBPACK_IMPORTED_MODULE_0__.EraseArrangement();
        this.autoTileEraser = new _AutoTileEraseArrangement__WEBPACK_IMPORTED_MODULE_1__.AutoTileEraseArrangement();
        this._tiledMapData = null;
    }
    setTiledMapData(tiledMapData) {
        this._tiledMapData = tiledMapData;
        this.autoTileEraser.setTiledMapData(tiledMapData);
    }
    setAutoTiles(autoTiles) {
        this.autoTileEraser.setAutoTiles(autoTiles);
    }
    apply(paints) {
        const autoTilePaints = [];
        const otherPaints = [];
        paints.forEach(paint => {
            if (!this._tiledMapData)
                throw new Error('MapData is not set.');
            const chip = this._tiledMapData.getFromChipPosition(paint.x, paint.y);
            if ((chip === null || chip === void 0 ? void 0 : chip.arrangementName) === 'AutoTileArrangement') {
                autoTilePaints.push(paint);
            }
            else {
                otherPaints.push(paint);
            }
        });
        return [...this.autoTileEraser.apply(autoTilePaints), ...this.defaultEraser.apply(otherPaints)];
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Arrangements/EraseArrangement.js":
/*!*******************************************************************!*\
  !*** ../map-editor/dist/Brushes/Arrangements/EraseArrangement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EraseArrangementDescription": () => (/* binding */ EraseArrangementDescription),
/* harmony export */   "EraseArrangement": () => (/* binding */ EraseArrangement)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
const EraseArrangementDescription = {
    name: 'EraseArrangement',
    create: () => new EraseArrangement()
};
class EraseArrangement {
    apply(paints) {
        return paints.map(paint => ({ ...paint, item: null }));
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/Brushes.js":
/*!*********************************************!*\
  !*** ../map-editor/dist/Brushes/Brushes.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Brushes": () => (/* binding */ Brushes)
/* harmony export */ });
/* harmony import */ var _Pen__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pen */ "../map-editor/dist/Brushes/Pen.js");
/* harmony import */ var _RectangleBrush__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RectangleBrush */ "../map-editor/dist/Brushes/RectangleBrush.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */


const registeredBrushDescriptions = [
    _Pen__WEBPACK_IMPORTED_MODULE_0__.PenDescription,
    _RectangleBrush__WEBPACK_IMPORTED_MODULE_1__.RectangleBrushDescription
];
const Brushes = registeredBrushDescriptions.map(description => ({
    name: description.name,
    create: () => description.create()
}));


/***/ }),

/***/ "../map-editor/dist/Brushes/Pen.js":
/*!*****************************************!*\
  !*** ../map-editor/dist/Brushes/Pen.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PenDescription": () => (/* binding */ PenDescription),
/* harmony export */   "Pen": () => (/* binding */ Pen)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
const PenDescription = {
    name: 'Pen',
    create: () => new Pen()
};
class Pen {
    constructor() {
        this._isMouseDown = false;
        this.painting = [];
        this._beforeCursorPosition = { x: -1, y: -1 };
        this._arrangement = null;
    }
    setArrangement(arrangement) {
        this._arrangement = arrangement;
    }
    mouseDown(chipX, chipY) {
        this._isMouseDown = true;
        this.painting = [];
    }
    mouseMove(chipX, chipY) {
        if (!this._arrangement)
            throw new Error('Arrangement is not set.');
        if (!this._isMouseDown)
            return [];
        const paint = {
            x: chipX,
            y: chipY,
            item: null
        };
        if (paint.x !== this._beforeCursorPosition.x || paint.y !== this._beforeCursorPosition.y) {
            this.painting.push(paint);
            this._beforeCursorPosition = paint;
        }
        return this._arrangement.apply(this.painting);
    }
    mouseUp(chipX, chipY) {
        if (!this._arrangement)
            throw new Error('Arrangement is not set.');
        this._isMouseDown = false;
        return this._arrangement.apply(this.painting);
    }
    cleanUp() {
        this.painting.length = 0;
        this._beforeCursorPosition = { x: -1, y: -1 };
    }
}


/***/ }),

/***/ "../map-editor/dist/Brushes/RectangleBrush.js":
/*!****************************************************!*\
  !*** ../map-editor/dist/Brushes/RectangleBrush.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RectangleBrushDescription": () => (/* binding */ RectangleBrushDescription),
/* harmony export */   "RectangleBrush": () => (/* binding */ RectangleBrush)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
const RectangleBrushDescription = {
    name: 'RectangleBrush',
    create: () => new RectangleBrush()
};
class RectangleBrush {
    constructor() {
        this._isMouseDown = false;
        this._startPosition = { x: 0, y: 0 };
        this._arrangement = null;
    }
    setArrangement(arrangement) {
        this._arrangement = arrangement;
    }
    mouseDown(chipX, chipY) {
        this._isMouseDown = true;
        this._startPosition = { x: chipX, y: chipY };
    }
    mouseMove(chipX, chipY) {
        if (!this._isMouseDown)
            return [];
        return this._build(chipX, chipY);
    }
    mouseUp(chipX, chipY) {
        this._isMouseDown = false;
        return this._build(chipX, chipY);
    }
    _build(chipX, chipY) {
        if (!this._arrangement)
            throw new Error('Arrangement is not set.');
        const paints = [];
        const startX = Math.min(this._startPosition.x, chipX);
        const startY = Math.min(this._startPosition.y, chipY);
        const endX = Math.max(this._startPosition.x, chipX);
        const endY = Math.max(this._startPosition.y, chipY);
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                paints.push({ x, y });
            }
        }
        return this._arrangement.apply(paints);
    }
    cleanUp() {
    }
}


/***/ }),

/***/ "../map-editor/dist/CallbackCaller.js":
/*!********************************************!*\
  !*** ../map-editor/dist/CallbackCaller.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CallbackCaller": () => (/* binding */ CallbackCaller)
/* harmony export */ });
/* harmony import */ var _CallbackItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CallbackItem */ "../map-editor/dist/CallbackItem.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class CallbackCaller {
    constructor() {
        this._items = [];
        this._maxId = 1;
    }
    get length() {
        return this._items.length;
    }
    get items() {
        return this._items;
    }
    has(callbackItem) {
        return !!this._items.find(item => item === callbackItem);
    }
    add(proc) {
        const callbackItem = new _CallbackItem__WEBPACK_IMPORTED_MODULE_0__.CallbackItem(proc, this._maxId++);
        this._items.push(callbackItem);
        return callbackItem;
    }
    call() {
        this._items.forEach(item => item.call());
    }
    remove(removedCallbackItem) {
        const index = this._items.findIndex(item => item === removedCallbackItem);
        if (index < 0)
            throw Error('CallbackCaller is not found');
        this._items.splice(index, 1);
    }
}


/***/ }),

/***/ "../map-editor/dist/CallbackCallers.js":
/*!*********************************************!*\
  !*** ../map-editor/dist/CallbackCallers.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CallbackCallers": () => (/* binding */ CallbackCallers)
/* harmony export */ });
/* harmony import */ var _CallbackCaller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CallbackCaller */ "../map-editor/dist/CallbackCaller.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class CallbackCallers {
    constructor() {
        this._callers = new Map();
    }
    getCallbackCaller(key) {
        return this._callers.get(key);
    }
    has(key, callbackItem) {
        var _a;
        return !!((_a = this._callers.get(key)) === null || _a === void 0 ? void 0 : _a.has(callbackItem));
    }
    add(key, callback) {
        let caller = this._callers.get(key);
        if (!caller) {
            caller = new _CallbackCaller__WEBPACK_IMPORTED_MODULE_0__.CallbackCaller();
            this._callers.set(key, caller);
        }
        return caller.add(callback);
    }
    call(key) {
        var _a;
        (_a = this._callers.get(key)) === null || _a === void 0 ? void 0 : _a.call();
    }
    remove(key, callbackItem) {
        var _a;
        (_a = this._callers.get(key)) === null || _a === void 0 ? void 0 : _a.remove(callbackItem);
    }
}


/***/ }),

/***/ "../map-editor/dist/CallbackItem.js":
/*!******************************************!*\
  !*** ../map-editor/dist/CallbackItem.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CallbackItem": () => (/* binding */ CallbackItem)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class CallbackItem {
    constructor(_proc, _id = -1) {
        this._proc = _proc;
        this._id = _id;
        this._caller = null;
    }
    get id() {
        return this._id;
    }
    call() {
        if (!this._proc)
            new Error('Callback function is not set');
        this._proc.call(this._caller);
    }
}


/***/ }),

/***/ "../map-editor/dist/ColiderCanvas.js":
/*!*******************************************!*\
  !*** ../map-editor/dist/ColiderCanvas.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColiderCanvas": () => (/* binding */ ColiderCanvas)
/* harmony export */ });
/* harmony import */ var _ColiderRenderer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColiderRenderer */ "../map-editor/dist/ColiderRenderer.js");
/* harmony import */ var _Brushes_Pen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Brushes/Pen */ "../map-editor/dist/Brushes/Pen.js");
/* harmony import */ var _Brushes_Brushes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Brushes/Brushes */ "../map-editor/dist/Brushes/Brushes.js");
/* harmony import */ var _Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Brushes/Arrangements/Arrangement */ "../map-editor/dist/Brushes/Arrangements/Arrangement.js");
/* harmony import */ var _Brushes_Arrangements_ColiderArrangement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Brushes/Arrangements/ColiderArrangement */ "../map-editor/dist/Brushes/Arrangements/ColiderArrangement.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */





class ColiderCanvas {
    constructor() {
        this._coliderCtx = null;
        this._secondaryCanvasCtx = null;
        this._secondaryCanvas = null;
        this._project = null;
        this._coliderRenderer = null;
        this._arrangement = new _Brushes_Arrangements_ColiderArrangement__WEBPACK_IMPORTED_MODULE_4__.ColiderArrangement();
        this._isMouseDown = false;
        this._lastMapChipPosition = { x: -1, y: -1 };
        this._selectedColiderType = 0;
        this._selectedSubColiderType = 0;
        this._renderAllCallbackItem = null;
        this._brush = new _Brushes_Pen__WEBPACK_IMPORTED_MODULE_1__.Pen();
        this._setupBrush();
    }
    get selectedColiderType() {
        return this._selectedColiderType;
    }
    get selectedSubColiderType() {
        return this._selectedSubColiderType;
    }
    get project() {
        if (!this._project)
            throw new Error('The project is not set');
        return this._project;
    }
    get hasProject() {
        return !!this._project;
    }
    get coliderCtx() {
        if (!this._coliderCtx)
            throw new Error('A canvas is not set');
        return this._coliderCtx;
    }
    get secondaryCanvasCtx() {
        if (!this._secondaryCanvasCtx)
            throw new Error('A canvas is not set');
        return this._secondaryCanvasCtx;
    }
    get coliderRenderer() {
        if (!this._coliderRenderer)
            throw new Error('The project is not set');
        return this._coliderRenderer;
    }
    get secondaryCanvas() {
        if (!this._secondaryCanvas)
            throw new Error('A canvas is not set');
        return this._secondaryCanvas;
    }
    get isMouseDown() {
        return this._isMouseDown;
    }
    get renderable() {
        return !!this._coliderCtx && !!this._coliderRenderer;
    }
    get isSubscribedProjectEvent() {
        return !!this._renderAllCallbackItem;
    }
    setProject(project) {
        if (this.isSubscribedProjectEvent)
            throw new Error('This colider-canvas is subscribed to the project event. You need to unsubscribe.');
        this._project = project;
        this._coliderRenderer = new _ColiderRenderer__WEBPACK_IMPORTED_MODULE_0__.ColiderRenderer(this._project.tiledMap);
        if (this.renderable && this._coliderCtx) {
            this.coliderRenderer.renderAll(this._coliderCtx);
        }
    }
    subscribeProjectEvent() {
        if (this._renderAllCallbackItem)
            throw new Error('Project Event is already subscribed');
        if (!this._project)
            throw new Error('Project is not set');
        this._renderAllCallbackItem = this._project.setCallback('renderAll', () => {
            if (!this.renderable || !this._coliderCtx)
                return;
            this.coliderRenderer.renderAll(this._coliderCtx);
        });
    }
    unsubscribeProjectEvent() {
        if (this._project && this._renderAllCallbackItem)
            this._project.removeCallback('renderAll', this._renderAllCallbackItem);
        this._renderAllCallbackItem = null;
    }
    setCanvas(canvas, secondaryCanvas) {
        this._coliderCtx = canvas.getContext('2d');
        this._secondaryCanvasCtx = secondaryCanvas.getContext('2d');
        this._secondaryCanvas = secondaryCanvas;
        if (this.renderable) {
            this.coliderRenderer.renderAll(this._coliderCtx);
        }
    }
    setBrush(brush) {
        this._brush = brush;
        this._setupBrush();
    }
    setArrangement(value) {
        this._arrangement = value;
    }
    setBrushFromName(brushName) {
        const registeredBrush = _Brushes_Brushes__WEBPACK_IMPORTED_MODULE_2__.Brushes.find(registeredBrush => registeredBrush.name === brushName);
        if (!registeredBrush) {
            this.setBrush(new _Brushes_Pen__WEBPACK_IMPORTED_MODULE_1__.Pen());
        }
        else {
            this.setBrush(registeredBrush.create());
        }
    }
    setColiderType(value) {
        this._selectedColiderType = value;
    }
    setSubColiderType(value) {
        this._selectedSubColiderType = value;
    }
    _setupBrush(isSubButton = false) {
        this._brush.setArrangement(this._arrangement);
        if ((0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_3__.isColiderTypesRequired)(this._arrangement)) {
            this._arrangement.setColiderTypes(isSubButton ? this._selectedSubColiderType : this._selectedColiderType);
        }
    }
    mouseDown(x, y, isSubButton = false) {
        this._isMouseDown = true;
        this._setupBrush(isSubButton);
        const chipPosition = this.convertFromCursorPositionToChipPosition(x, y);
        this._brush.mouseDown(chipPosition.x, chipPosition.y);
        this._paint(chipPosition);
        this._lastMapChipPosition = chipPosition;
    }
    mouseMove(x, y) {
        const chipPosition = this.convertFromCursorPositionToChipPosition(x, y);
        if (!this._isMouseDown)
            return chipPosition;
        if (chipPosition.x === this._lastMapChipPosition.x && chipPosition.y === this._lastMapChipPosition.y)
            return chipPosition;
        this._paint(chipPosition);
        this._lastMapChipPosition = chipPosition;
        return chipPosition;
    }
    mouseUp(x, y) {
        this._isMouseDown = false;
        const chipPosition = this.convertFromCursorPositionToChipPosition(x, y);
        this._brush.mouseUp(chipPosition.x, chipPosition.y).forEach(paint => {
            const chip = paint.item;
            this.putChip(chip, paint.x, paint.y);
        });
        this.clearSecondaryCanvas();
        this._brush.cleanUp();
        this._lastMapChipPosition = { x: -1, y: -1 };
    }
    _paint(chipPosition) {
        this.clearSecondaryCanvas();
        this._brush.mouseMove(chipPosition.x, chipPosition.y).forEach(paint => {
            const chip = paint.item;
            this.coliderRenderer.putOrClearChipToCanvas(this.secondaryCanvasCtx, chip, paint.x, paint.y, true);
        });
    }
    putChip(coliderType, chipX, chipY) {
        this.project.tiledMap.coliders.put(coliderType, chipX, chipY);
        this.coliderRenderer.putOrClearChipToCanvas(this.coliderCtx, coliderType, chipX, chipY);
    }
    clearSecondaryCanvas() {
        this.secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height);
    }
    convertFromCursorPositionToChipPosition(x, y) {
        return {
            x: Math.max(0, Math.min(Math.floor(x / this.project.tiledMap.chipWidth), this.project.tiledMap.chipCountX - 1)),
            y: Math.max(0, Math.min(Math.floor(y / this.project.tiledMap.chipHeight), this.project.tiledMap.chipCountY - 1))
        };
    }
}


/***/ }),

/***/ "../map-editor/dist/ColiderRenderer.js":
/*!*********************************************!*\
  !*** ../map-editor/dist/ColiderRenderer.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColiderRenderer": () => (/* binding */ ColiderRenderer)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class ColiderRenderer {
    constructor(_tiledMap) {
        this._tiledMap = _tiledMap;
        this._backgroundRgba = { r: 255, g: 255, b: 255, a: 1.0 };
    }
    renderAll(ctx) {
        this._tiledMap.coliders.items.forEach((value, index) => {
            const position = this._tiledMap.convertMapNumberToPosition(index);
            this.putOrClearChipToCanvas(ctx, value, position.x, position.y);
        });
    }
    putOrClearChipToCanvas(ctx, coliderType, chipX, chipY, isTemporaryRendering = false) {
        if (coliderType === 1) {
            this._putToCanvas(ctx, chipX, chipY);
        }
        else {
            this._clearChipToCanvas(ctx, chipX, chipY, isTemporaryRendering);
        }
    }
    _clearChipToCanvas(ctx, chipX, chipY, isTemporaryRendering) {
        const position = this._tiledMap.convertChipPositionToPixel(chipX, chipY);
        ctx.clearRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight);
        if (isTemporaryRendering) {
            ctx.fillStyle = `rgba(${this._backgroundRgba.r},${this._backgroundRgba.g},${this._backgroundRgba.b},${this._backgroundRgba.a})`;
            ctx.fillRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight);
        }
    }
    _putToCanvas(ctx, chipX, chipY) {
        const position = this._tiledMap.convertChipPositionToPixel(chipX, chipY);
        ctx.clearRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight);
    }
}


/***/ }),

/***/ "../map-editor/dist/CursorPositionConverter.js":
/*!*****************************************************!*\
  !*** ../map-editor/dist/CursorPositionConverter.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "convertFromCursorPositionToChipPosition": () => (/* binding */ convertFromCursorPositionToChipPosition),
/* harmony export */   "convertChipPositionDivisionByCursorSize": () => (/* binding */ convertChipPositionDivisionByCursorSize)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
function convertFromCursorPositionToChipPosition(x, y, chipWidth, chipHeight, chipCountX, chipCountY, cursorWidth = 1, cursorHeight = 1) {
    const offsetX = (Math.floor(cursorWidth / 2) * chipWidth) / 2;
    const offsetY = (Math.floor(cursorHeight / 2) * chipHeight) / 2;
    return {
        x: Math.max(0, Math.min(Math.floor((x - offsetX) / chipWidth), chipCountX - cursorWidth)),
        y: Math.max(0, Math.min(Math.floor((y - offsetY) / chipHeight), chipCountY - cursorHeight))
    };
}
function convertChipPositionDivisionByCursorSize(x, y, baseX, baseY, cursorWidth, cursorHeight) {
    return {
        x: Math.floor((x - baseX) / cursorWidth) * cursorWidth + baseX,
        y: Math.floor((y - baseY) / cursorHeight) * cursorHeight + baseY,
    };
}


/***/ }),

/***/ "../map-editor/dist/GridImageGenerator.js":
/*!************************************************!*\
  !*** ../map-editor/dist/GridImageGenerator.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GridImageGenerator": () => (/* binding */ GridImageGenerator)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class GridImageGenerator {
    constructor() {
        this._width = 0;
        this._height = 0;
        this._changed = false;
        this._color = '#000000';
    }
    get changed() {
        return this._changed;
    }
    get gridColor() {
        return this._color;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    set gridColor(color) {
        this._changed = this._color !== color;
        this._color = color;
    }
    setGridSize(width, height) {
        this._changed = (this._width !== width) || (this._height !== height);
        this._width = width;
        this._height = height;
    }
    generateDottedPart() {
        const { canvas, context } = this.createCanvas();
        context.fillRect(this._width - 1, this._height - 1, 1, 1);
        return canvas;
    }
    generateLinePart() {
        const { canvas, context } = this.createCanvas();
        context.fillRect(0, this._height - 1, this._width, 1);
        context.fillRect(this._width - 1, 0, 1, this._height);
        return canvas;
    }
    createCanvas() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error();
        }
        canvas.width = this._width;
        canvas.height = this._height;
        context.fillStyle = this._color;
        return {
            canvas,
            context
        };
    }
}


/***/ }),

/***/ "../map-editor/dist/Injector.js":
/*!**************************************!*\
  !*** ../map-editor/dist/Injector.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Injector": () => (/* binding */ Injector)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class Injector {
    inject(calledObject, method, before, after) {
        const original = calledObject[method.name];
        calledObject[method.name] = (...args) => {
            if (before)
                before();
            const result = original.apply(calledObject, args);
            if (after)
                after();
            return result;
        };
    }
}


/***/ }),

/***/ "../map-editor/dist/MapCanvas.js":
/*!***************************************!*\
  !*** ../map-editor/dist/MapCanvas.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapCanvas": () => (/* binding */ MapCanvas)
/* harmony export */ });
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");
/* harmony import */ var _Brushes_Pen__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Brushes/Pen */ "../map-editor/dist/Brushes/Pen.js");
/* harmony import */ var _Brushes_Brushes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Brushes/Brushes */ "../map-editor/dist/Brushes/Brushes.js");
/* harmony import */ var _Brushes_Arrangements_Arrangements__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Brushes/Arrangements/Arrangements */ "../map-editor/dist/Brushes/Arrangements/Arrangements.js");
/* harmony import */ var _Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Brushes/Arrangements/Arrangement */ "../map-editor/dist/Brushes/Arrangements/Arrangement.js");
/* harmony import */ var _Brushes_Arrangements_DefaultArrangement__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Brushes/Arrangements/DefaultArrangement */ "../map-editor/dist/Brushes/Arrangements/DefaultArrangement.js");
/* harmony import */ var _MapChipPicker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MapChipPicker */ "../map-editor/dist/MapChipPicker.js");
/* harmony import */ var _CursorPositionConverter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CursorPositionConverter */ "../map-editor/dist/CursorPositionConverter.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */








class MapCanvas {
    constructor() {
        this._secondaryCanvasCtx = null;
        this._isMouseDown = false;
        this._brush = new _Brushes_Pen__WEBPACK_IMPORTED_MODULE_1__.Pen();
        this._arrangement = new _Brushes_Arrangements_DefaultArrangement__WEBPACK_IMPORTED_MODULE_5__.DefaultArrangement();
        this._lastMapChipPosition = { x: -1, y: -1 };
        this._mapMouseDownPosition = { x: -1, y: -1 };
        this._canvasContexts = [];
        this.secondaryCanvas = null;
        this._project = null;
        this._renderer = null;
        this._selectedAutoTile = null;
        this._selectedMapChipFragments = [];
        this._selectedMapChipFragmentBoundarySize = { width: 0, height: 0 };
        this._activeLayerIndex = 0;
        this._mapChipPickerEnabled = true;
        this._mapChipPicker = null;
        this._isPickFromActiveLayer = false;
        this._pickedCallback = null;
        this._renderAllCallbackItem = null;
    }
    get selectedAutoTile() {
        return this._selectedAutoTile;
    }
    get selectedMapChipFragments() {
        return this._selectedMapChipFragments;
    }
    get project() {
        if (!this._project)
            throw new Error('Project is not set');
        return this._project;
    }
    get hasProject() {
        return !!this._project;
    }
    get renderer() {
        if (!this._renderer)
            throw new Error('Renderer is not set');
        return this._renderer;
    }
    get activeLayer() {
        return this._activeLayerIndex;
    }
    get isMouseDown() {
        return this._isMouseDown;
    }
    get renderable() {
        return this._canvasContexts.length > 0 && !!this._renderer;
    }
    get mapChipPickerEnabled() {
        return this._mapChipPickerEnabled;
    }
    get isPickFromActiveLayer() {
        return this._isPickFromActiveLayer;
    }
    get selectedMapChipFragmentBoundarySize() {
        return this._selectedMapChipFragmentBoundarySize;
    }
    set isPickFromActiveLayer(value) {
        this._isPickFromActiveLayer = value;
    }
    get isSubscribedProjectEvent() {
        return !!this._renderAllCallbackItem;
    }
    hasActiveAutoTile() {
        return !!this._selectedAutoTile;
    }
    setProject(project) {
        if (this._project === project)
            throw new Error('This project has already been set.');
        if (this.isSubscribedProjectEvent)
            throw new Error('This map-canvas is subscribed to the project event. You need to unsubscribe.');
        this._project = project;
        this._renderer = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.MapRenderer(this._project.tiledMap);
        this._mapChipPicker = new _MapChipPicker__WEBPACK_IMPORTED_MODULE_6__.MapChipPicker(this._project.tiledMap);
        this._setupBrush();
    }
    subscribeProjectEvent() {
        if (this._renderAllCallbackItem)
            throw new Error('Project Event is already subscribed');
        if (!this._project)
            throw new Error('Project is not set');
        this._renderAllCallbackItem = this._project.setCallback('renderAll', () => this.renderAll());
    }
    unsubscribeProjectEvent() {
        if (this._project && this._renderAllCallbackItem)
            this._project.removeCallback('renderAll', this._renderAllCallbackItem);
        this._renderAllCallbackItem = null;
    }
    async firstRenderAll() {
        if (!this._project)
            return;
        await this._project.tiledMap.mapChipsCollection.waitWhileLoading();
        if (this.renderable) {
            this.renderAll();
        }
    }
    renderAll() {
        if (!this.renderable)
            return;
        const renderer = this.renderer;
        this._canvasContexts.forEach((ctx, index) => (this.project.tiledMap.datas.length > index) && renderer.renderLayer(index, ctx));
    }
    setCanvases(canvases, secondaryCanvas) {
        this._canvasContexts = canvases.map(canvas => canvas.getContext('2d'));
        this.secondaryCanvas = secondaryCanvas;
        this._secondaryCanvasCtx = this.secondaryCanvas.getContext('2d');
        if (this.renderable) {
            this.renderAll();
        }
    }
    addCanvas(canvas) {
        this._canvasContexts.push(canvas.getContext('2d'));
    }
    setAutoTile(value) {
        this._selectedAutoTile = value;
        this._selectedMapChipFragmentBoundarySize = { width: 1, height: 1 };
    }
    setMapChipFragments(value) {
        this._selectedMapChipFragments = value;
        const boundary = value
            .reduce((acc, val) => ({ x1: Math.min(acc.x1, val.x), y1: Math.min(acc.y1, val.y), x2: Math.max(acc.x2, val.x), y2: Math.max(acc.y2, val.y) }), { x1: value[0].x, y1: value[0].y, x2: value[0].x, y2: value[0].y });
        this._selectedMapChipFragmentBoundarySize = { width: boundary.x2 - boundary.x1 + 1, height: boundary.y2 - boundary.y1 + 1 };
    }
    setPickedCallback(callbackFn) {
        this._pickedCallback = callbackFn;
    }
    setBrushFromName(brushName) {
        const registeredBrush = _Brushes_Brushes__WEBPACK_IMPORTED_MODULE_2__.Brushes.find(registeredBrush => registeredBrush.name === brushName);
        if (!registeredBrush) {
            this.setBrush(new _Brushes_Pen__WEBPACK_IMPORTED_MODULE_1__.Pen());
        }
        else {
            this.setBrush(registeredBrush.create());
        }
    }
    setArrangementFromName(arrangementName) {
        const registeredArrangement = _Brushes_Arrangements_Arrangements__WEBPACK_IMPORTED_MODULE_3__.Arrangements.find(registered => registered.name === arrangementName);
        if (!registeredArrangement) {
            this.setArrangement(new _Brushes_Arrangements_DefaultArrangement__WEBPACK_IMPORTED_MODULE_5__.DefaultArrangement());
        }
        else {
            this.setArrangement(registeredArrangement.create());
        }
    }
    setActiveLayer(index) {
        if (!this._project)
            return;
        if (index < 0 || index >= this._project.tiledMap.datas.length) {
            throw new Error('The layer index is out of range.');
        }
        this._activeLayerIndex = index;
        this._setupBrush();
    }
    setMapChipPickerEnabled(value) {
        this._mapChipPickerEnabled = value;
    }
    _setupBrush() {
        if (!this._project || !this._arrangement)
            return;
        this._brush.setArrangement(this._arrangement);
        if ((0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__.isTiledMapDataRequired)(this._arrangement)) {
            this._arrangement.setTiledMapData(this._project.tiledMap.datas[this._activeLayerIndex]);
        }
    }
    setArrangement(arrangement) {
        this._arrangement = arrangement;
        this._setupBrush();
    }
    setBrush(brush) {
        this._brush = brush;
        this._setupBrush();
    }
    mouseDown(x, y, isSubButton = false) {
        const chipPosition = this.convertFromCursorPositionToChipPosition(x, y);
        if (isSubButton && this._mapChipPickerEnabled) {
            this.pick(chipPosition.x, chipPosition.y);
            return;
        }
        if ((0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__.isMapChipFragmentRequired)(this._arrangement) && !(0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__.isAutoTileRequired)(this._arrangement) && this._selectedMapChipFragments.length < 1)
            return;
        if ((0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__.isAutoTileRequired)(this._arrangement) && !this.selectedAutoTile)
            return;
        this._isMouseDown = true;
        if ((0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__.isMapChipFragmentRequired)(this._arrangement)) {
            this._arrangement.setMapChips(this._selectedMapChipFragments);
        }
        if ((0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__.isAutoTileRequired)(this._arrangement) && this._selectedAutoTile) {
            this._arrangement.setAutoTile(this._selectedAutoTile);
        }
        if ((0,_Brushes_Arrangements_Arrangement__WEBPACK_IMPORTED_MODULE_4__.isAutoTilesRequired)(this._arrangement)) {
            this._arrangement.setAutoTiles(this.project.tiledMap.autoTiles);
        }
        this._brush.mouseDown(chipPosition.x, chipPosition.y);
        this._mapMouseDownPosition = this._lastMapChipPosition = chipPosition;
        this._paint(chipPosition);
    }
    mouseMove(x, y) {
        const cursorPosition = this.convertFromCursorPositionToChipPosition(x, y);
        const chipPosition = (0,_CursorPositionConverter__WEBPACK_IMPORTED_MODULE_7__.convertChipPositionDivisionByCursorSize)(cursorPosition.x, cursorPosition.y, this._mapMouseDownPosition.x, this._mapMouseDownPosition.y, this._selectedMapChipFragmentBoundarySize.width, this._selectedMapChipFragmentBoundarySize.height);
        if (!this._isMouseDown)
            return chipPosition;
        if (chipPosition.x === this._lastMapChipPosition.x && chipPosition.y === this._lastMapChipPosition.y)
            return chipPosition;
        this._paint(chipPosition);
        this._lastMapChipPosition = chipPosition;
        return chipPosition;
    }
    mouseUp() {
        if (!this._isMouseDown)
            return;
        const chipPosition = this._lastMapChipPosition;
        this._brush.mouseUp(chipPosition.x, chipPosition.y).forEach(paint => {
            const chip = paint.item;
            this.putChip(chip, paint.x, paint.y);
        });
        this.reset();
    }
    reset() {
        if (!this._isMouseDown)
            return;
        this._isMouseDown = false;
        this.clearSecondaryCanvas();
        this._brush.cleanUp();
        this._mapMouseDownPosition = this._lastMapChipPosition = { x: -1, y: -1 };
    }
    putChip(mapChip, chipX, chipY) {
        this.project.tiledMap.put(mapChip, chipX, chipY, this._activeLayerIndex);
        this.renderer.putOrClearChipToCanvas(this._canvasContexts[this._activeLayerIndex], mapChip, chipX, chipY);
    }
    _paint(chipPosition) {
        this.clearSecondaryCanvas();
        this._brush.mouseMove(chipPosition.x, chipPosition.y).forEach(paint => {
            if (!this._secondaryCanvasCtx)
                return;
            const chip = paint.item;
            this.renderer.putOrClearChipToCanvas(this._secondaryCanvasCtx, chip, paint.x, paint.y, true);
        });
    }
    clearSecondaryCanvas() {
        if (!this.secondaryCanvas || !this._secondaryCanvasCtx)
            return;
        this._secondaryCanvasCtx.clearRect(0, 0, this.secondaryCanvas.width, this.secondaryCanvas.height);
    }
    convertFromCursorPositionToChipPosition(x, y) {
        return (0,_CursorPositionConverter__WEBPACK_IMPORTED_MODULE_7__.convertFromCursorPositionToChipPosition)(x, y, this.project.tiledMap.chipWidth, this.project.tiledMap.chipHeight, this.project.tiledMap.chipCountX, this.project.tiledMap.chipCountY, this._selectedMapChipFragmentBoundarySize.width, this._selectedMapChipFragmentBoundarySize.height);
    }
    pick(x, y) {
        var _a, _b;
        if (!this._mapChipPicker)
            return;
        const picked = this._isPickFromActiveLayer ? (_a = this._mapChipPicker) === null || _a === void 0 ? void 0 : _a.pick(x, y, this._activeLayerIndex) : (_b = this._mapChipPicker) === null || _b === void 0 ? void 0 : _b.pick(x, y);
        if ((0,_piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.isAutoTileMapChip)(picked)) {
            const autoTile = this.project.tiledMap.autoTiles.fromId(picked.autoTileId);
            if (autoTile)
                this.setAutoTile(autoTile);
        }
        else if (picked) {
            this.setMapChipFragments(picked.items);
        }
        if (this._pickedCallback)
            this._pickedCallback(picked);
    }
}


/***/ }),

/***/ "../map-editor/dist/MapChipPicker.js":
/*!*******************************************!*\
  !*** ../map-editor/dist/MapChipPicker.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapChipPicker": () => (/* binding */ MapChipPicker)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class MapChipPicker {
    constructor(_tiledMap) {
        this._tiledMap = _tiledMap;
    }
    pick(x, y, layerIndex) {
        if (layerIndex !== undefined) {
            return this._tiledMap.datas[layerIndex].getFromChipPosition(x, y);
        }
        return this._tiledMap.datas.reduce((acc, data) => {
            const chip = data.getFromChipPosition(x, y);
            if (chip)
                return chip;
            return acc;
        }, null);
    }
}


/***/ }),

/***/ "../map-editor/dist/MapChipSelector.js":
/*!*********************************************!*\
  !*** ../map-editor/dist/MapChipSelector.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapChipSelector": () => (/* binding */ MapChipSelector)
/* harmony export */ });
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class MapChipSelector {
    constructor(_tiledMap, _chipImage) {
        this._tiledMap = _tiledMap;
        this._chipImage = _chipImage;
        this._selectedChips = [];
        this._selecting = false;
        this._startChipPosition = { x: -1, y: -1 };
        this._endChipPosition = { x: -1, y: -1 };
    }
    get chipImage() {
        return this._chipImage;
    }
    get selectedChips() {
        return this._selectedChips;
    }
    get selecting() {
        return this._selecting;
    }
    get startChipPosition() {
        return {
            x: Math.min(this._startChipPosition.x, this._endChipPosition.x),
            y: Math.min(this._startChipPosition.y, this._endChipPosition.y)
        };
    }
    get startPosition() {
        const startChipPosition = this.startChipPosition;
        return {
            x: startChipPosition.x * this._tiledMap.chipWidth,
            y: startChipPosition.y * this._tiledMap.chipHeight
        };
    }
    get selectedChipSize() {
        return {
            width: (Math.abs(this._endChipPosition.x - this._startChipPosition.x) + 1),
            height: (Math.abs(this._endChipPosition.y - this._startChipPosition.y) + 1)
        };
    }
    get selectedSize() {
        const selectedChipSize = this.selectedChipSize;
        return {
            width: selectedChipSize.width * this._tiledMap.chipWidth,
            height: selectedChipSize.height * this._tiledMap.chipHeight
        };
    }
    clear() {
        this._selectedChips.length = 0;
    }
    _selectAtMouseCursor() {
        this.clear();
        const chipPosition = {
            x: Math.min(this._startChipPosition.x, this._endChipPosition.x),
            y: Math.min(this._startChipPosition.y, this._endChipPosition.y)
        };
        const maximumChipCount = this._chipImage.getChipCount(this._tiledMap.chipWidth, this._tiledMap.chipHeight);
        const { width, height } = this.selectedChipSize;
        if (chipPosition.x + width > maximumChipCount.width) {
            chipPosition.x = maximumChipCount.width - width;
        }
        if (chipPosition.y + height > maximumChipCount.height) {
            chipPosition.y = maximumChipCount.height - height;
        }
        if (chipPosition.x < 0 || chipPosition.y < 0) {
            throw new Error('MapChipImage is not enough size.');
        }
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this._selectedChips.push(new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment(chipPosition.x + x, chipPosition.y + y, this._chipImage.id));
            }
        }
    }
    mouseDown(x, y) {
        const chipPosition = this.convertFromImagePositionToChipPosition(x, y);
        this._startChipPosition = { ...chipPosition };
        this._endChipPosition = { ...chipPosition };
        this._selecting = true;
    }
    mouseMove(x, y) {
        if (!this._selecting)
            return;
        const chipPosition = this.convertFromImagePositionToChipPosition(x, y);
        this._endChipPosition = { ...chipPosition };
    }
    mouseUp(x, y) {
        if (!this._selecting)
            return;
        const chipPosition = this.convertFromImagePositionToChipPosition(x, y);
        this._endChipPosition = { ...chipPosition };
        this._selectAtMouseCursor();
        this._selecting = false;
    }
    convertFromImagePositionToChipPosition(x, y) {
        const chipCount = this._chipImage.getChipCount(this._tiledMap.chipWidth, this._tiledMap.chipHeight);
        return {
            x: Math.max(0, Math.min(Math.floor(x / this._tiledMap.chipWidth), chipCount.width - 1)),
            y: Math.max(0, Math.min(Math.floor(y / this._tiledMap.chipHeight), chipCount.height - 1))
        };
    }
}


/***/ }),

/***/ "../map-editor/dist/Projects.js":
/*!**************************************!*\
  !*** ../map-editor/dist/Projects.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Project": () => (/* binding */ Project),
/* harmony export */   "Projects": () => (/* binding */ Projects)
/* harmony export */ });
/* harmony import */ var _CallbackCallers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CallbackCallers */ "../map-editor/dist/CallbackCallers.js");
/* harmony import */ var _Injector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Injector */ "../map-editor/dist/Injector.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */


class Project {
    constructor(_tiledMap, _projectId) {
        this._tiledMap = _tiledMap;
        this._projectId = _projectId;
        this._callbacks = new _CallbackCallers__WEBPACK_IMPORTED_MODULE_0__.CallbackCallers();
        const injector = new _Injector__WEBPACK_IMPORTED_MODULE_1__.Injector();
        injector.inject(_tiledMap, _tiledMap.addLayer, () => this._beforeAddLayerHandler(), null);
        injector.inject(_tiledMap, _tiledMap.resize, null, () => this._afterResizedMapHandler());
        injector.inject(_tiledMap.autoTiles, _tiledMap.autoTiles.push, null, () => this._afterAddAutoTileHandler());
        injector.inject(_tiledMap.autoTiles, _tiledMap.autoTiles.remove, null, () => this._afterRemoveAutoTileHandler());
        injector.inject(_tiledMap.mapChipsCollection, _tiledMap.mapChipsCollection.replace, null, () => this._afterReplacedMapChipImageHandler());
    }
    get callbacks() {
        return this._callbacks;
    }
    get projectId() {
        return this._projectId;
    }
    get tiledMap() {
        return this._tiledMap;
    }
    requestRenderAll() {
        this._callbacks.call('renderAll');
    }
    setCallback(key, callback) {
        return this._callbacks.add(key, callback);
    }
    removeCallback(key, callbackItem) {
        this._callbacks.remove(key, callbackItem);
    }
    _beforeAddLayerHandler() {
        this._callbacks.call('beforeAddLayer');
    }
    _afterAddAutoTileHandler() {
        this._callbacks.call('afterAddAutoTile');
    }
    _afterRemoveAutoTileHandler() {
        this._callbacks.call('afterRemoveAutoTile');
    }
    _afterReplacedMapChipImageHandler() {
        this._callbacks.call('afterReplacedMapChipImage');
    }
    _afterResizedMapHandler() {
        this._callbacks.call('afterResizedMap');
    }
}
class Projects {
    static setProjectAddCallbackFunction(fn) {
        this._projectAddCallbackFunctions.push(fn);
    }
    static get items() {
        return Projects._items;
    }
    static add(tiledMap, projectId = -1) {
        const id = projectId > 0 ? projectId : Projects.createId();
        const project = new Project(tiledMap, id);
        Projects._items.push(project);
        this._projectAddCallbackFunctions.forEach(fn => fn());
        return project;
    }
    static clear() {
        this._items.length = 0;
    }
    static fromProjectId(projectId) {
        return this._items.find(item => item.projectId === projectId) || null;
    }
    static createId() {
        return ++Projects._idCounter;
    }
}
Projects._idCounter = 0;
Projects._items = [];
Projects._projectAddCallbackFunctions = [];


/***/ }),

/***/ "../map-editor/dist/main.js":
/*!**********************************!*\
  !*** ../map-editor/dist/main.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GridImageGenerator": () => (/* reexport safe */ _GridImageGenerator__WEBPACK_IMPORTED_MODULE_0__.GridImageGenerator),
/* harmony export */   "CallbackItem": () => (/* reexport safe */ _CallbackItem__WEBPACK_IMPORTED_MODULE_1__.CallbackItem),
/* harmony export */   "MapCanvas": () => (/* reexport safe */ _MapCanvas__WEBPACK_IMPORTED_MODULE_2__.MapCanvas),
/* harmony export */   "Projects": () => (/* reexport safe */ _Projects__WEBPACK_IMPORTED_MODULE_3__.Projects),
/* harmony export */   "Project": () => (/* reexport safe */ _Projects__WEBPACK_IMPORTED_MODULE_3__.Project),
/* harmony export */   "ColiderCanvas": () => (/* reexport safe */ _ColiderCanvas__WEBPACK_IMPORTED_MODULE_4__.ColiderCanvas),
/* harmony export */   "AutoTileSelector": () => (/* reexport safe */ _AutoTileSelector__WEBPACK_IMPORTED_MODULE_5__.AutoTileSelector),
/* harmony export */   "MapChipSelector": () => (/* reexport safe */ _MapChipSelector__WEBPACK_IMPORTED_MODULE_6__.MapChipSelector),
/* harmony export */   "convertFromCursorPositionToChipPosition": () => (/* reexport safe */ _CursorPositionConverter__WEBPACK_IMPORTED_MODULE_7__.convertFromCursorPositionToChipPosition),
/* harmony export */   "convertChipPositionDivisionByCursorSize": () => (/* reexport safe */ _CursorPositionConverter__WEBPACK_IMPORTED_MODULE_7__.convertChipPositionDivisionByCursorSize)
/* harmony export */ });
/* harmony import */ var _GridImageGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GridImageGenerator */ "../map-editor/dist/GridImageGenerator.js");
/* harmony import */ var _CallbackItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CallbackItem */ "../map-editor/dist/CallbackItem.js");
/* harmony import */ var _MapCanvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MapCanvas */ "../map-editor/dist/MapCanvas.js");
/* harmony import */ var _Projects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Projects */ "../map-editor/dist/Projects.js");
/* harmony import */ var _ColiderCanvas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ColiderCanvas */ "../map-editor/dist/ColiderCanvas.js");
/* harmony import */ var _AutoTileSelector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AutoTileSelector */ "../map-editor/dist/AutoTileSelector.js");
/* harmony import */ var _MapChipSelector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MapChipSelector */ "../map-editor/dist/MapChipSelector.js");
/* harmony import */ var _CursorPositionConverter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CursorPositionConverter */ "../map-editor/dist/CursorPositionConverter.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */










/***/ }),

/***/ "../tiled-map/dist/AutoTile/AutoTile.js":
/*!**********************************************!*\
  !*** ../tiled-map/dist/AutoTile/AutoTile.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoTile": () => (/* binding */ AutoTile)
/* harmony export */ });
/* harmony import */ var _MapChip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../MapChip */ "../tiled-map/dist/MapChip.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class AutoTile {
    constructor(_mapChipFragments, _id) {
        this._mapChipFragments = _mapChipFragments;
        this._id = _id;
    }
    get id() {
        return this._id;
    }
    get mapChipFragments() {
        return this._mapChipFragments;
    }
    getMapChipImageIds() {
        const chipIds = new Set();
        this._mapChipFragments.forEach(fragment => chipIds.add(fragment.chipId));
        return Array.from(chipIds.values());
    }
    toObject() {
        return {
            id: this._id,
            mapChipFragments: this._mapChipFragments.map(fragment => fragment.toObject())
        };
    }
    static fromObject(val) {
        return new AutoTile(val.mapChipFragments.map(fragment => _MapChip__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment.fromObject(fragment)), val.id);
    }
}
//# sourceMappingURL=AutoTile.js.map

/***/ }),

/***/ "../tiled-map/dist/AutoTile/AutoTiles.js":
/*!***********************************************!*\
  !*** ../tiled-map/dist/AutoTile/AutoTiles.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoTiles": () => (/* binding */ AutoTiles)
/* harmony export */ });
/* harmony import */ var _AutoTile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AutoTile */ "../tiled-map/dist/AutoTile/AutoTile.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class AutoTiles {
    constructor() {
        this._autoTiles = new Map();
        this._maxId = 0;
    }
    get length() {
        return this._autoTiles.size;
    }
    push(item) {
        this._autoTiles.set(item.id, item);
        this._maxId = Math.max(this._maxId, item.id);
    }
    remove(item) {
        this._autoTiles.delete(item.id);
    }
    findByImage(image) {
        const valuesItr = this._autoTiles.values();
        return Array.from(valuesItr).filter(autoTile => autoTile.mapChipFragments.some(fragment => fragment.chipId === image.id));
    }
    fromId(id) {
        return this._autoTiles.get(id) || null;
    }
    values() {
        return this._autoTiles.values();
    }
    import(strategy) {
        const mapChipFragmentGroups = strategy.getMapChipFragments();
        return mapChipFragmentGroups.map(group => {
            const autoTile = new _AutoTile__WEBPACK_IMPORTED_MODULE_0__.AutoTile(group, ++this._maxId);
            this.push(autoTile);
            return autoTile;
        });
    }
    toObject() {
        const objectedAutoTiles = [];
        const valuesItr = this._autoTiles.values();
        for (const val of valuesItr) {
            objectedAutoTiles.push(val.toObject());
        }
        return {
            autoTiles: objectedAutoTiles
        };
    }
    fromObject(val) {
        this._autoTiles.clear();
        val.autoTiles.forEach(objectedAutoTile => {
            const autoTile = _AutoTile__WEBPACK_IMPORTED_MODULE_0__.AutoTile.fromObject(objectedAutoTile);
            this.push(autoTile);
            this._maxId = Math.max(this._maxId, autoTile.id);
        });
    }
}
//# sourceMappingURL=AutoTiles.js.map

/***/ }),

/***/ "../tiled-map/dist/AutoTile/DefaultAutoTileImportStrategy.js":
/*!*******************************************************************!*\
  !*** ../tiled-map/dist/AutoTile/DefaultAutoTileImportStrategy.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DefaultAutoTileImportStrategy": () => (/* binding */ DefaultAutoTileImportStrategy)
/* harmony export */ });
/* harmony import */ var _MapChip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../MapChip */ "../tiled-map/dist/MapChip.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class DefaultAutoTileImportStrategy {
    constructor(_mapChipImage, _chipWidth, _chipHeight) {
        this._mapChipImage = _mapChipImage;
        this._chipWidth = _chipWidth;
        this._chipHeight = _chipHeight;
    }
    getMapChipFragments() {
        const heightChipCountPerUnit = 5;
        const countX = Math.floor(this._mapChipImage.image.width / this._chipWidth);
        const countY = Math.floor(Math.floor(this._mapChipImage.image.height / this._chipHeight) / heightChipCountPerUnit);
        const mapChipFragmentGroups = [];
        for (let cy = 0; cy < countY; cy++) {
            const y = cy * heightChipCountPerUnit;
            for (let x = 0; x < countX; x++) {
                const mapChipFragments = [];
                mapChipFragments.push(new _MapChip__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment(x, y, this._mapChipImage.id));
                mapChipFragments.push(new _MapChip__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment(x, y + 1, this._mapChipImage.id));
                mapChipFragments.push(new _MapChip__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment(x, y + 2, this._mapChipImage.id));
                mapChipFragments.push(new _MapChip__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment(x, y + 3, this._mapChipImage.id));
                mapChipFragments.push(new _MapChip__WEBPACK_IMPORTED_MODULE_0__.MapChipFragment(x, y + 4, this._mapChipImage.id));
                mapChipFragmentGroups.push(mapChipFragments);
            }
        }
        return mapChipFragmentGroups;
    }
}
//# sourceMappingURL=DefaultAutoTileImportStrategy.js.map

/***/ }),

/***/ "../tiled-map/dist/MapChip.js":
/*!************************************!*\
  !*** ../tiled-map/dist/MapChip.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapChipFragment": () => (/* binding */ MapChipFragment),
/* harmony export */   "MapChip": () => (/* binding */ MapChip),
/* harmony export */   "isAutoTileMapChipProperties": () => (/* binding */ isAutoTileMapChipProperties),
/* harmony export */   "AutoTileMapChip": () => (/* binding */ AutoTileMapChip),
/* harmony export */   "isAutoTileMapChip": () => (/* binding */ isAutoTileMapChip)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class MapChipFragment {
    constructor(_x, _y, _chipId, 
    /**
     *  _renderingArea indicates the area where this map-chip is to be drawn.
     *  It is represented by a OR of the following area-numbers.
     *
     * |<- 1chip ->|
     * *-----*-----* ---
     * |  1  |  2  |  ↑
     * *-----*-----* 1chip
     * |  4  |  8  |  ↓
     * *-----*-----* ---
     */
    _renderingArea = 15) {
        this._x = _x;
        this._y = _y;
        this._chipId = _chipId;
        this._renderingArea = _renderingArea;
        this._identifyKey = '';
        this._identifyKey = `${_x},${_y},${_chipId}`;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get chipId() {
        return this._chipId;
    }
    get identifyKey() {
        return this._identifyKey;
    }
    get renderingArea() {
        return this._renderingArea;
    }
    withParameter(parameters) {
        if (parameters.x)
            this._x = parameters.x;
        if (parameters.y)
            this._y = parameters.y;
        if (parameters.renderingArea)
            this._renderingArea = parameters.renderingArea;
        return this;
    }
    clone() {
        return new MapChipFragment(this._x, this._y, this._chipId);
    }
    compare(others) {
        return this.identifyKey === others.identifyKey;
    }
    toObject() {
        return {
            x: this._x,
            y: this._y,
            chipId: this._chipId,
            renderingArea: this._renderingArea
        };
    }
    static fromObject(val) {
        return new MapChipFragment(val.x, val.y, val.chipId, val.renderingArea);
    }
}
class MapChip {
    constructor(_items = [], _arrangementName = '') {
        this._items = _items;
        this._arrangementName = _arrangementName;
        this._identifyKey = '';
        this._buildIdentifyKey();
    }
    get items() {
        return this._items;
    }
    get identifyKey() {
        return this._identifyKey;
    }
    get length() {
        return this._items.length;
    }
    get arrangementName() {
        return this._arrangementName;
    }
    _buildIdentifyKey() {
        this._identifyKey = this._items.map(item => item.identifyKey).join('|');
    }
    setArrangementName(name) {
        this._arrangementName = name;
    }
    push(mapChip) {
        this._items.push(mapChip);
        this._buildIdentifyKey();
    }
    clear() {
        this._items.length = 0;
        this._buildIdentifyKey();
    }
    clone() {
        const cloned = new MapChip();
        cloned._items = this._items.map(mapChip => mapChip.clone());
        return cloned;
    }
    compare(others) {
        return this.identifyKey === others.identifyKey;
    }
    toObject() {
        return {
            items: this._items.map(item => item.toObject()),
            arrangementName: this._arrangementName
        };
    }
    static fromObject(val) {
        return new MapChip(val.items.map(item => MapChipFragment.fromObject(item)), val.arrangementName);
    }
}
function isAutoTileMapChipProperties(obj) {
    return obj &&
        typeof obj.autoTileId === 'number' &&
        obj.boundary !== undefined &&
        obj.cross !== undefined;
}
class AutoTileMapChip extends MapChip {
    constructor(_autoTileId, items = [], _arrangementName = '', _boundary = {
        top: false,
        bottom: false,
        left: false,
        right: false
    }, _cross = {
        topLeft: false,
        topRight: false,
        bottomLeft: false,
        bottomRight: false
    }) {
        super(items, _arrangementName);
        this._autoTileId = _autoTileId;
        this._boundary = _boundary;
        this._cross = _cross;
    }
    get boundary() {
        return this._boundary;
    }
    get cross() {
        return this._cross;
    }
    get autoTileId() {
        return this._autoTileId;
    }
    setBoundary(boundary) {
        this._boundary = boundary;
    }
    setCross(cross) {
        this._cross = cross;
    }
    toObject() {
        return {
            ...super.toObject(),
            boundary: this._boundary,
            cross: this._cross,
            autoTileId: this._autoTileId
        };
    }
    static fromObject(val) {
        return new AutoTileMapChip(val.autoTileId, val.items.map(item => MapChipFragment.fromObject(item)), val.arrangementName, val.boundary, val.cross);
    }
}
function isAutoTileMapChip(obj) {
    return obj &&
        typeof obj.boundary === 'object' &&
        typeof obj.cross === 'object';
}
//# sourceMappingURL=MapChip.js.map

/***/ }),

/***/ "../tiled-map/dist/MapChipImage.js":
/*!*****************************************!*\
  !*** ../tiled-map/dist/MapChipImage.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapChipImage": () => (/* binding */ MapChipImage)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class MapChipImage {
    constructor(_src, _id) {
        this._src = _src;
        this._id = _id;
        this._image = new Image();
        this._hasImage = false;
        this._hasError = false;
        this.loadImage();
    }
    get id() {
        return this._id;
    }
    get src() {
        return this._src;
    }
    get hasImage() {
        return this._hasImage;
    }
    get hasError() {
        return this._hasError;
    }
    get image() {
        return this._image;
    }
    getChipCount(chipWidth, chipHeight) {
        if (!this._hasImage)
            throw new Error('Image loading is not complete.');
        return {
            width: Math.floor(this._image.width / chipWidth),
            height: Math.floor(this._image.height / chipHeight)
        };
    }
    _loadImageHandler() {
        this._hasImage = true;
    }
    _errorImaegHandler() {
        this._hasError = true;
    }
    loadImage() {
        this._hasImage = false;
        this._hasError = false;
        this._image.onload = () => this._loadImageHandler();
        this._image.onerror = () => this._errorImaegHandler();
        this._image.src = this._src;
    }
    waitWhileLoading() {
        const loadingPromise = new Promise((resolve, reject) => {
            this._image.onload = () => {
                this._loadImageHandler();
                resolve();
            };
            this._image.onerror = () => {
                this._errorImaegHandler();
                reject(new Error('Failed to load the image.'));
            };
        });
        if (this._hasImage)
            return Promise.resolve();
        if (this._hasError)
            return Promise.reject(new Error('Failed to load the image.'));
        return loadingPromise;
    }
    toObject() {
        return {
            id: this._id,
            src: this._src
        };
    }
    static fromObject(val) {
        return new MapChipImage(val.src, val.id);
    }
}
//# sourceMappingURL=MapChipImage.js.map

/***/ }),

/***/ "../tiled-map/dist/MapChipsCollection.js":
/*!***********************************************!*\
  !*** ../tiled-map/dist/MapChipsCollection.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapChipsCollection": () => (/* binding */ MapChipsCollection)
/* harmony export */ });
/* harmony import */ var _MapChipImage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MapChipImage */ "../tiled-map/dist/MapChipImage.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class MapChipsCollection {
    constructor() {
        this._items = new Map();
    }
    push(item) {
        this._items.set(item.id, item);
    }
    remove(item) {
        this._items.delete(item.id);
    }
    replace(replacement) {
        const target = this.findById(replacement.id);
        if (!target)
            throw new Error('Target MapChipImage cannot be found.');
        this.remove(target);
        this.push(replacement);
    }
    findById(chipId) {
        return this._items.get(chipId) || null;
    }
    getItems() {
        return Array.from(this._items.values());
    }
    async waitWhileLoading() {
        await Promise.all(Array.from(this._items.values()).map(item => item.waitWhileLoading()));
    }
    toObject() {
        const objectedMapChipImage = [];
        const valuesItr = this._items.values();
        for (const val of valuesItr) {
            objectedMapChipImage.push(val.toObject());
        }
        return {
            items: objectedMapChipImage
        };
    }
    fromObject(val) {
        this._items.clear();
        val.items.forEach(objectedVal => {
            this.push(_MapChipImage__WEBPACK_IMPORTED_MODULE_0__.MapChipImage.fromObject(objectedVal));
        });
    }
}
//# sourceMappingURL=MapChipsCollection.js.map

/***/ }),

/***/ "../tiled-map/dist/MapData/ColiderMap.js":
/*!***********************************************!*\
  !*** ../tiled-map/dist/MapData/ColiderMap.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColiderMap": () => (/* binding */ ColiderMap)
/* harmony export */ });
/* harmony import */ var _MapMatrix__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MapMatrix */ "../tiled-map/dist/MapData/MapMatrix.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class ColiderMap extends _MapMatrix__WEBPACK_IMPORTED_MODULE_0__.MapMatrix {
    toObject() {
        return {
            chipCountX: this._chipCountX,
            chipCountY: this._chipCountY,
            coliders: this._items
        };
    }
    static fromObject(val) {
        return new ColiderMap(val.chipCountX, val.chipCountY, val.coliders);
    }
    allocate() {
        super.allocate(0);
    }
}
//# sourceMappingURL=ColiderMap.js.map

/***/ }),

/***/ "../tiled-map/dist/MapData/MapMatrix.js":
/*!**********************************************!*\
  !*** ../tiled-map/dist/MapData/MapMatrix.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapMatrix": () => (/* binding */ MapMatrix)
/* harmony export */ });
/* harmony import */ var _TransferEach__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TransferEach */ "../tiled-map/dist/MapData/TransferEach.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */

class MapMatrix {
    constructor(_chipCountX, _chipCountY, items = []) {
        this._chipCountX = _chipCountX;
        this._chipCountY = _chipCountY;
        this._items = [];
        if (items.length > 0 && this.size !== items.length) {
            throw new Error();
        }
        if (items.length === 0) {
            this.allocate();
        }
        else {
            this._items = items;
        }
    }
    get size() {
        return this._chipCountX * this._chipCountY;
    }
    get width() {
        return this._chipCountX;
    }
    get height() {
        return this._chipCountY;
    }
    get items() {
        return this._items;
    }
    set(items) {
        if (items.length !== this._items.length)
            throw new Error();
        this._items = items;
    }
    transferFromTiledMapData(src, srcX, srcY, width, height, destX, destY) {
        (0,_TransferEach__WEBPACK_IMPORTED_MODULE_0__.transferEach)(srcX, srcY, width, height, destX, destY, src.width, src.height, this.width, this.height, (pickupX, pickupY, putX, putY) => {
            const item = src.getFromChipPosition(pickupX, pickupY);
            this.put(item, putX, putY);
        });
    }
    resize(chipCountX, chipCountY, emptyValue) {
        const src = this.clone();
        this._chipCountX = chipCountX;
        this._chipCountY = chipCountY;
        this.allocate(emptyValue);
        this.transferFromTiledMapData(src, 0, 0, src.width, src.height, 0, 0);
    }
    getFromChipPosition(x, y) {
        if (this.isOutOfRange(x, y))
            throw new Error('The position is out of range.');
        const mapNumber = this.convertPositionToMapNumber(x, y);
        return this._items[mapNumber];
    }
    put(item, x, y) {
        const mapNumber = this.convertPositionToMapNumber(x, y);
        this._items[mapNumber] = item;
    }
    clone() {
        return new MapMatrix(this._chipCountX, this._chipCountY, this._items);
    }
    convertPositionToMapNumber(x, y) {
        return y * this._chipCountX + x;
    }
    isOutOfRange(x, y) {
        return (x < 0) || (y < 0) || (x >= this._chipCountX) || (y >= this._chipCountY);
    }
    allocate(defaultValue = null) {
        this._items = new Array(this._chipCountY * this._chipCountX).fill(defaultValue);
    }
}
//# sourceMappingURL=MapMatrix.js.map

/***/ }),

/***/ "../tiled-map/dist/MapData/MapPaletteMatrix.js":
/*!*****************************************************!*\
  !*** ../tiled-map/dist/MapData/MapPaletteMatrix.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapPaletteMatrix": () => (/* binding */ MapPaletteMatrix)
/* harmony export */ });
/* harmony import */ var _TransferEach__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TransferEach */ "../tiled-map/dist/MapData/TransferEach.js");
/* harmony import */ var _MapMatrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MapMatrix */ "../tiled-map/dist/MapData/MapMatrix.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */


class MapPaletteMatrix {
    constructor(chipCountX, chipCountY, items = []) {
        this._paletteIndexes = new Map();
        this._values = new _MapMatrix__WEBPACK_IMPORTED_MODULE_1__.MapMatrix(0, 0, []);
        this._palette = [];
        this._values = new _MapMatrix__WEBPACK_IMPORTED_MODULE_1__.MapMatrix(chipCountX, chipCountY, new Array(chipCountY * chipCountX).fill(-1));
        if (items.length > 0) {
            this.set(items);
        }
    }
    get size() {
        return this._values.size;
    }
    get width() {
        return this._values.width;
    }
    get height() {
        return this._values.height;
    }
    get items() {
        return this._values.items.map(value => value >= 0 ? this._palette[value] : null);
    }
    get palette() {
        return this._palette;
    }
    get values() {
        return this._values;
    }
    set(items) {
        if (items.length !== this._values.items.length)
            throw new Error();
        this._values.set(items.map(value => this._getOrGeneratePaletteIndex(value)));
    }
    setValuePalette(values, palette) {
        if (values.length !== this._values.items.length)
            throw new Error();
        this._values.set([...values]);
        this._palette = [...palette];
        this._paletteIndexes.clear();
        for (const [index, paletteItem] of this._palette.entries()) {
            if (!paletteItem)
                continue;
            if (this._paletteIndexes.has(paletteItem.identifyKey)) {
                this.rebuild();
                break;
            }
            this._paletteIndexes.set(paletteItem.identifyKey, index);
        }
    }
    transferFromTiledMapData(src, srcX, srcY, width, height, destX, destY) {
        (0,_TransferEach__WEBPACK_IMPORTED_MODULE_0__.transferEach)(srcX, srcY, width, height, destX, destY, src.width, src.height, this.width, this.height, (pickupX, pickupY, putX, putY) => {
            const item = src.getFromChipPosition(pickupX, pickupY);
            this._values.put(this._getOrGeneratePaletteIndex(item), putX, putY);
        });
    }
    resize(chipCountX, chipCountY, emptyValue) {
        this._values.resize(chipCountX, chipCountY, this._getOrGeneratePaletteIndex(emptyValue));
    }
    getFromChipPosition(x, y) {
        const paletteIndex = this._values.getFromChipPosition(x, y);
        return paletteIndex >= 0 ? this._palette[paletteIndex] : null;
    }
    put(item, x, y) {
        this._values.put(this._getOrGeneratePaletteIndex(item), x, y);
    }
    clone() {
        const cloned = new MapPaletteMatrix(this.width, this.height);
        cloned.setValuePalette(this._values.items, this._palette);
        return cloned;
    }
    rebuild() {
        const items = this.items;
        this._palette = [];
        this._paletteIndexes.clear();
        this.set(items);
    }
    remove(target) {
        if (!target)
            return false;
        const removePaletteId = this.palette.findIndex(item => (item === null || item === void 0 ? void 0 : item.identifyKey) === target.identifyKey);
        if (removePaletteId < 0)
            return false;
        this.palette.splice(removePaletteId, 1);
        this.values.items.forEach((paletteIndex, valueIndex) => {
            if (paletteIndex === removePaletteId)
                this.values.items[valueIndex] = -1;
            if (paletteIndex > removePaletteId)
                this.values.items[valueIndex] = this.values.items[valueIndex] - 1;
        });
        for (const [k, v] of this._paletteIndexes.entries()) {
            if (v > removePaletteId)
                this._paletteIndexes.set(k, v - 1);
        }
        this._paletteIndexes.delete(target.identifyKey);
        return true;
    }
    getPaletteIndex(value) {
        if (value === null)
            return -1;
        return this._paletteIndexes.get(value.identifyKey);
    }
    _getOrGeneratePaletteIndex(value) {
        if (value === null)
            return -1;
        const index = this.getPaletteIndex(value);
        if (index !== undefined)
            return index;
        this._palette.push(value);
        const addedIndex = this._palette.length - 1;
        this._paletteIndexes.set(value.identifyKey, addedIndex);
        return addedIndex;
    }
}
//# sourceMappingURL=MapPaletteMatrix.js.map

/***/ }),

/***/ "../tiled-map/dist/MapData/TiledMapData.js":
/*!*************************************************!*\
  !*** ../tiled-map/dist/MapData/TiledMapData.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TiledMapData": () => (/* binding */ TiledMapData)
/* harmony export */ });
/* harmony import */ var _MapChip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../MapChip */ "../tiled-map/dist/MapChip.js");
/* harmony import */ var _MapPaletteMatrix__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MapPaletteMatrix */ "../tiled-map/dist/MapData/MapPaletteMatrix.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */


class TiledMapData extends _MapPaletteMatrix__WEBPACK_IMPORTED_MODULE_1__.MapPaletteMatrix {
    filter(needles) {
        const filtered = this.items.map(chip => needles.some(needle => !!chip && needle.compare(chip)) ? chip : null);
        return new TiledMapData(this.width, this.height, filtered);
    }
    findByImage(image) {
        const registeredChips = new Set();
        return this.items.filter(chip => {
            if (!chip)
                return false;
            const found = chip.items.find(fragment => fragment.chipId === image.id) && !registeredChips.has(chip.identifyKey);
            if (found) {
                registeredChips.add(chip.identifyKey);
            }
            return found;
        });
    }
    toObject() {
        return {
            chipCountX: this.width,
            chipCountY: this.height,
            values: this.values.items,
            palette: this.palette.map(data => data ? data.toObject() : null)
        };
    }
    static fromObject(val) {
        const palette = val.palette.map(data => {
            if (!data)
                return null;
            if ((0,_MapChip__WEBPACK_IMPORTED_MODULE_0__.isAutoTileMapChipProperties)(data)) {
                return _MapChip__WEBPACK_IMPORTED_MODULE_0__.AutoTileMapChip.fromObject(data);
            }
            return _MapChip__WEBPACK_IMPORTED_MODULE_0__.MapChip.fromObject(data);
        });
        const tiledMapData = new TiledMapData(val.chipCountX, val.chipCountY, []);
        tiledMapData.setValuePalette(val.values, palette);
        return tiledMapData;
    }
}
//# sourceMappingURL=TiledMapData.js.map

/***/ }),

/***/ "../tiled-map/dist/MapData/TransferEach.js":
/*!*************************************************!*\
  !*** ../tiled-map/dist/MapData/TransferEach.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "transferEach": () => (/* binding */ transferEach)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
function transferEach(srcX, srcY, width, height, destX, destY, srcWidth, srcHeight, destWidth, destHeight, callback) {
    for (let x = 0; x < width; x++) {
        const putX = destX + x;
        const pickupX = srcX + x;
        if (putX < 0 || putX >= destWidth)
            continue;
        if (pickupX < 0 || pickupX >= srcWidth)
            continue;
        for (let y = 0; y < height; y++) {
            const putY = destY + y;
            const pickupY = srcY + y;
            if (putY < 0 || putY >= destHeight)
                continue;
            if (pickupY < 0 || pickupY >= srcHeight)
                continue;
            callback(pickupX, pickupY, putX, putY);
        }
    }
}
//# sourceMappingURL=TransferEach.js.map

/***/ }),

/***/ "../tiled-map/dist/MapRenderer.js":
/*!****************************************!*\
  !*** ../tiled-map/dist/MapRenderer.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MapRenderer": () => (/* binding */ MapRenderer)
/* harmony export */ });
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */
class MapRenderer {
    constructor(_tiledMap) {
        this._tiledMap = _tiledMap;
        this._backgroundRgba = { r: 255, g: 255, b: 255, a: 1.0 };
    }
    setTiledMap(tiledMap) {
        this._tiledMap = tiledMap;
    }
    renderAll(ctx) {
        this._tiledMap.datas.forEach(data => this.render(data, ctx));
    }
    renderLayer(index, ctx) {
        this.render(this._tiledMap.datas[index], ctx);
    }
    render(data, ctx) {
        data.items.forEach((value, index) => {
            const position = this._tiledMap.convertMapNumberToPosition(index);
            this.putOrClearChipToCanvas(ctx, value, position.x, position.y);
        });
    }
    putOrClearChipToCanvas(ctx, mapChip, chipX, chipY, isTemporaryRendering = false) {
        if (!mapChip) {
            this._clearChipToCanvas(ctx, chipX, chipY, isTemporaryRendering);
        }
        else {
            mapChip.items.forEach(item => {
                this._putChipToCanvas(ctx, item, chipX, chipY);
            });
        }
    }
    _clearChipToCanvas(ctx, chipX, chipY, isTemporaryRendering) {
        const position = this._tiledMap.convertChipPositionToPixel(chipX, chipY);
        ctx.clearRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight);
        if (isTemporaryRendering) {
            ctx.fillStyle = `rgba(${this._backgroundRgba.r},${this._backgroundRgba.g},${this._backgroundRgba.b},${this._backgroundRgba.a})`;
            ctx.fillRect(position.x, position.y, this._tiledMap.chipWidth, this._tiledMap.chipHeight);
        }
    }
    _putChipToCanvas(ctx, mapChip, chipX, chipY) {
        const mapChips = this._tiledMap.mapChipsCollection.findById(mapChip.chipId);
        const image = mapChips === null || mapChips === void 0 ? void 0 : mapChips.image;
        if (!image)
            return;
        const renderingArea = this._getRenderingArea(mapChip);
        const position = this._tiledMap.convertChipPositionToPixel(chipX, chipY);
        position.x += renderingArea.destOffsetX;
        position.y += renderingArea.destOffsetY;
        ctx.clearRect(position.x, position.y, renderingArea.width, renderingArea.height);
        ctx.drawImage(image, renderingArea.x, renderingArea.y, renderingArea.width, renderingArea.height, position.x, position.y, renderingArea.width, renderingArea.height);
    }
    _getRenderingArea(mapChip) {
        const width = this._tiledMap.chipWidth;
        const height = this._tiledMap.chipHeight;
        const x = mapChip.x * width;
        const y = mapChip.y * height;
        if (mapChip.renderingArea === 15) {
            return { x, y, width, height, destOffsetX: 0, destOffsetY: 0 };
        }
        const halfWidth = Math.round(width / 2);
        const halfHeight = Math.round(height / 2);
        switch (mapChip.renderingArea) {
            case 1:
                return { x, y, width: halfWidth, height: halfHeight, destOffsetX: 0, destOffsetY: 0 };
            case 2:
                return { x: x + halfWidth, y, width: halfWidth, height: halfHeight, destOffsetX: halfWidth, destOffsetY: 0 };
            case 3:
                return { x, y, width, height: halfHeight, destOffsetX: 0, destOffsetY: 0 };
            case 4:
                return { x, y: y + halfHeight, width: halfWidth, height: halfHeight, destOffsetX: 0, destOffsetY: halfHeight };
            case 5:
                return { x, y, width: halfWidth, height, destOffsetX: 0, destOffsetY: 0 };
            case 8:
                return { x: x + halfWidth, y: y + halfHeight, width: halfWidth, height: halfHeight, destOffsetX: halfWidth, destOffsetY: halfHeight };
            case 10:
                return { x: x + halfWidth, y, width: halfWidth, height, destOffsetX: halfWidth, destOffsetY: 0 };
            case 12:
                return { x, y: y + halfHeight, width, height: halfHeight, destOffsetX: 0, destOffsetY: halfHeight };
        }
    }
}
//# sourceMappingURL=MapRenderer.js.map

/***/ }),

/***/ "../tiled-map/dist/TiledMap.js":
/*!*************************************!*\
  !*** ../tiled-map/dist/TiledMap.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TiledMap": () => (/* binding */ TiledMap)
/* harmony export */ });
/* harmony import */ var _MapChipsCollection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MapChipsCollection */ "../tiled-map/dist/MapChipsCollection.js");
/* harmony import */ var _AutoTile_AutoTiles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AutoTile/AutoTiles */ "../tiled-map/dist/AutoTile/AutoTiles.js");
/* harmony import */ var _MapData_TiledMapData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MapData/TiledMapData */ "../tiled-map/dist/MapData/TiledMapData.js");
/* harmony import */ var _MapData_ColiderMap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MapData/ColiderMap */ "../tiled-map/dist/MapData/ColiderMap.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */




class TiledMap {
    constructor(_chipCountX, _chipCountY, _chipWidth, _chipHeight) {
        this._chipCountX = _chipCountX;
        this._chipCountY = _chipCountY;
        this._chipWidth = _chipWidth;
        this._chipHeight = _chipHeight;
        this._mapChipImages = new _MapChipsCollection__WEBPACK_IMPORTED_MODULE_0__.MapChipsCollection();
        this._autoTiles = new _AutoTile_AutoTiles__WEBPACK_IMPORTED_MODULE_1__.AutoTiles();
        this._datas = [];
        this._coliders = new _MapData_ColiderMap__WEBPACK_IMPORTED_MODULE_3__.ColiderMap(this._chipCountX, this._chipCountY);
        this.addLayer();
    }
    get chipWidth() {
        return this._chipWidth;
    }
    get chipHeight() {
        return this._chipHeight;
    }
    get chipCountX() {
        return this._chipCountX;
    }
    get chipCountY() {
        return this._chipCountY;
    }
    get mapChipsCollection() {
        return this._mapChipImages;
    }
    get autoTiles() {
        return this._autoTiles;
    }
    get datas() {
        return this._datas;
    }
    get coliders() {
        return this._coliders;
    }
    convertChipPositionToPixel(chipX, chipY) {
        return {
            x: chipX * this.chipWidth,
            y: chipY * this.chipHeight
        };
    }
    put(mapChip, chipX, chipY, index) {
        this._datas[index].put(mapChip, chipX, chipY);
    }
    toObject() {
        return {
            chipCountX: this._chipCountX,
            chipCountY: this._chipCountY,
            chipWidth: this._chipWidth,
            chipHeight: this._chipHeight,
            mapChipImages: this._mapChipImages.toObject(),
            autoTiles: this._autoTiles.toObject(),
            tiledMapDatas: this._datas.map(data => data.toObject()),
            coliders: this._coliders.toObject()
        };
    }
    addLayer() {
        this._datas.push(new _MapData_TiledMapData__WEBPACK_IMPORTED_MODULE_2__.TiledMapData(this._chipCountX, this._chipCountY));
    }
    convertMapNumberToPosition(num) {
        return {
            x: num % this._chipCountX,
            y: Math.floor(num / this._chipCountX)
        };
    }
    resize(chipCountX, chipCountY) {
        this._chipCountX = chipCountX;
        this._chipCountY = chipCountY;
        this._datas.forEach(item => item.resize(chipCountX, chipCountY, null));
        this._coliders.resize(chipCountX, chipCountY, 0);
    }
    setSerializedProperties(val) {
        this._mapChipImages.fromObject(val.mapChipImages);
        this._autoTiles.fromObject(val.autoTiles);
        this._datas = val.tiledMapDatas.map(tiledMapData => _MapData_TiledMapData__WEBPACK_IMPORTED_MODULE_2__.TiledMapData.fromObject(tiledMapData));
        this._coliders = _MapData_ColiderMap__WEBPACK_IMPORTED_MODULE_3__.ColiderMap.fromObject(val.coliders);
    }
    static fromObject(val) {
        const tiledMap = new TiledMap(val.chipCountX, val.chipCountY, val.chipWidth, val.chipHeight);
        tiledMap.setSerializedProperties({ mapChipImages: val.mapChipImages, autoTiles: val.autoTiles, tiledMapDatas: val.tiledMapDatas, coliders: val.coliders });
        return tiledMap;
    }
}
//# sourceMappingURL=TiledMap.js.map

/***/ }),

/***/ "../tiled-map/dist/main.js":
/*!*********************************!*\
  !*** ../tiled-map/dist/main.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TiledMap": () => (/* reexport safe */ _TiledMap__WEBPACK_IMPORTED_MODULE_0__.TiledMap),
/* harmony export */   "TiledMapData": () => (/* reexport safe */ _MapData_TiledMapData__WEBPACK_IMPORTED_MODULE_1__.TiledMapData),
/* harmony export */   "MapChipImage": () => (/* reexport safe */ _MapChipImage__WEBPACK_IMPORTED_MODULE_2__.MapChipImage),
/* harmony export */   "MapChipsCollection": () => (/* reexport safe */ _MapChipsCollection__WEBPACK_IMPORTED_MODULE_3__.MapChipsCollection),
/* harmony export */   "MapChipFragment": () => (/* reexport safe */ _MapChip__WEBPACK_IMPORTED_MODULE_4__.MapChipFragment),
/* harmony export */   "MapChip": () => (/* reexport safe */ _MapChip__WEBPACK_IMPORTED_MODULE_4__.MapChip),
/* harmony export */   "AutoTileMapChip": () => (/* reexport safe */ _MapChip__WEBPACK_IMPORTED_MODULE_4__.AutoTileMapChip),
/* harmony export */   "isAutoTileMapChip": () => (/* reexport safe */ _MapChip__WEBPACK_IMPORTED_MODULE_4__.isAutoTileMapChip),
/* harmony export */   "AutoTiles": () => (/* reexport safe */ _AutoTile_AutoTiles__WEBPACK_IMPORTED_MODULE_5__.AutoTiles),
/* harmony export */   "AutoTile": () => (/* reexport safe */ _AutoTile_AutoTile__WEBPACK_IMPORTED_MODULE_6__.AutoTile),
/* harmony export */   "DefaultAutoTileImportStrategy": () => (/* reexport safe */ _AutoTile_DefaultAutoTileImportStrategy__WEBPACK_IMPORTED_MODULE_7__.DefaultAutoTileImportStrategy),
/* harmony export */   "ColiderMap": () => (/* reexport safe */ _MapData_ColiderMap__WEBPACK_IMPORTED_MODULE_8__.ColiderMap),
/* harmony export */   "MapRenderer": () => (/* reexport safe */ _MapRenderer__WEBPACK_IMPORTED_MODULE_9__.MapRenderer)
/* harmony export */ });
/* harmony import */ var _TiledMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TiledMap */ "../tiled-map/dist/TiledMap.js");
/* harmony import */ var _MapData_TiledMapData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MapData/TiledMapData */ "../tiled-map/dist/MapData/TiledMapData.js");
/* harmony import */ var _MapChipImage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MapChipImage */ "../tiled-map/dist/MapChipImage.js");
/* harmony import */ var _MapChipsCollection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MapChipsCollection */ "../tiled-map/dist/MapChipsCollection.js");
/* harmony import */ var _MapChip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MapChip */ "../tiled-map/dist/MapChip.js");
/* harmony import */ var _AutoTile_AutoTiles__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AutoTile/AutoTiles */ "../tiled-map/dist/AutoTile/AutoTiles.js");
/* harmony import */ var _AutoTile_AutoTile__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AutoTile/AutoTile */ "../tiled-map/dist/AutoTile/AutoTile.js");
/* harmony import */ var _AutoTile_DefaultAutoTileImportStrategy__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./AutoTile/DefaultAutoTileImportStrategy */ "../tiled-map/dist/AutoTile/DefaultAutoTileImportStrategy.js");
/* harmony import */ var _MapData_ColiderMap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./MapData/ColiderMap */ "../tiled-map/dist/MapData/ColiderMap.js");
/* harmony import */ var _MapRenderer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./MapRenderer */ "../tiled-map/dist/MapRenderer.js");
/**
 * @license
 * Copyright 2021 piyoppi
 * SPDX-License-Identifier: MIT
 */










//# sourceMappingURL=main.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************************!*\
  !*** ./simple_map_editor/src/simple_map_editor.ts ***!
  \****************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _piyoppi_pico2map_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @piyoppi/pico2map-ui-components */ "../map-editor-components/dist/main.js");
/* harmony import */ var _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @piyoppi/pico2map-tiled */ "../tiled-map/dist/main.js");


// Define some custom elements
(0,_piyoppi_pico2map_ui_components__WEBPACK_IMPORTED_MODULE_0__.defineComponent)();
// Get some elements
const mapCanvas = document.getElementById('mapCanvas');
const coliderCanvas = document.getElementById('coliderCanvas');
const mapChipSelector = document.getElementById('mapChipSelector');
const autoTileSelector = document.getElementById('autoTileSelector');
const loadButton = document.getElementById('load');
const saveButton = document.getElementById('save');
const addLayerButton = document.getElementById('addlayer');
const rectangleRadioButton = document.getElementById('rectangle');
const eraseRadioButton = document.getElementById('erase');
const penRadioButton = document.getElementById('pen');
const mapChipModeRadioButton = document.getElementById('mapChipMode');
const coliderModeRadioButton = document.getElementById('coliderMode');
const coliderGroup = document.getElementById('coliderGroup');
const coliderTypeNoneRadioButton = document.getElementById('coliderTypeNone');
const coliderTypeColiderRadioButton = document.getElementById('coliderTypeColider');
const layerSelector = document.getElementById('layer');
coliderCanvas.style.display = 'none';
function setProjectId(id) {
    mapChipSelector.setAttribute('projectId', id.toString());
    autoTileSelector.setAttribute('projectId', id.toString());
    mapCanvas.setAttribute('projectId', id.toString());
    coliderCanvas.setAttribute('projectId', id.toString());
}
async function initialize() {
    const mapChipImage = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__.MapChipImage("images/chip.png", 1);
    const autoTileImage = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__.MapChipImage("images/auto-tile-sample.png", 2);
    await mapChipImage.waitWhileLoading();
    await autoTileImage.waitWhileLoading();
    const chipSize = { width: 32, height: 32 };
    let tiledMap = new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__.TiledMap(30, 30, chipSize.width, chipSize.height);
    tiledMap.addLayer();
    tiledMap.addLayer();
    // import MapChipImage and setup AutoTiles
    tiledMap.mapChipsCollection.push(mapChipImage);
    tiledMap.mapChipsCollection.push(autoTileImage);
    tiledMap.autoTiles.import(new _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__.DefaultAutoTileImportStrategy(autoTileImage, chipSize.width, chipSize.height));
    const project = _piyoppi_pico2map_ui_components__WEBPACK_IMPORTED_MODULE_0__.Projects.add(tiledMap);
    setProjectId(project.projectId);
    // Deserialze a data
    loadButton.onclick = async () => {
        const serializedData = localStorage.getItem('mapData');
        if (!serializedData)
            return;
        tiledMap = _piyoppi_pico2map_tiled__WEBPACK_IMPORTED_MODULE_1__.TiledMap.fromObject(JSON.parse(serializedData));
        // The image needs to be set again
        tiledMap.mapChipsCollection.push(mapChipImage);
        tiledMap.mapChipsCollection.push(autoTileImage);
        const newProject = _piyoppi_pico2map_ui_components__WEBPACK_IMPORTED_MODULE_0__.Projects.add(tiledMap);
        setProjectId(newProject.projectId);
        layerSelector.innerHTML = '';
        tiledMap.datas.forEach((_, index) => layerSelector.appendChild(new Option(index.toString(), index.toString())));
    };
    // Serialize a tiled-map data and set to the localStorage
    saveButton.onclick = () => localStorage.setItem('mapData', JSON.stringify(tiledMap.toObject()));
    mapCanvas.addEventListener('touchmove', e => { if (e.touches.length < 2)
        e.preventDefault(); });
    // Set a pen
    rectangleRadioButton.addEventListener('change', () => {
        mapCanvas.setAttribute('brush', 'RectangleBrush');
        coliderCanvas.setAttribute('brush', 'RectangleBrush');
    });
    penRadioButton.addEventListener('change', () => {
        mapCanvas.setAttribute('brush', 'Pen');
        coliderCanvas.setAttribute('brush', 'Pen');
    });
    // Set eraser arrangement
    // DefaultEraseArrangement put empty MapChips.
    eraseRadioButton.addEventListener('change', () => mapCanvas.setAttribute('arrangement', 'DefaultEraseArrangement'));
    mapChipModeRadioButton.addEventListener('change', _ => {
        // Set arrangement map-chips mode
        coliderCanvas.style.display = 'none';
        mapCanvas.removeAttribute('cursorHidden');
        coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none';
    });
    coliderModeRadioButton?.addEventListener('change', _ => {
        // Set colider-edit mode
        coliderCanvas.style.display = 'block';
        mapCanvas.setAttribute('cursorHidden', 'true');
        coliderGroup.style.display = coliderModeRadioButton.checked ? 'block' : 'none';
    });
    // Set an active colider type
    coliderTypeNoneRadioButton.addEventListener('change', () => {
        coliderCanvas?.setAttribute('coliderType', '0');
        coliderCanvas?.setAttribute('subColiderType', '1');
    });
    coliderTypeColiderRadioButton.addEventListener('change', () => {
        coliderCanvas?.setAttribute('coliderType', '1');
        coliderCanvas?.setAttribute('subColiderType', '0');
    });
    autoTileSelector.addEventListener('autotile-selected', (e) => {
        // Set a AutoTileArrangement.
        // AutoTileArrangement arranges appropriate MapChips.
        mapCanvas.setAttribute('arrangement', 'AutoTileArrangement');
        mapCanvas.setAttribute('brush', 'RectangleBrush');
        // Set an active AutoTile
        mapCanvas.setAttribute('autoTileId', e.detail.id.toString());
        rectangleRadioButton.checked = true;
    });
    mapChipSelector.addEventListener('mapchip-selected', (e) => {
        // Set an active MapChip
        mapCanvas.setAttribute('arrangement', 'DefaultArrangement');
        mapCanvas.setAttribute('mapChipFragmentProperties', JSON.stringify(e.detail.selectedMapChipProperties));
    });
    mapCanvas.addEventListener('mapchip-picked', e => {
        mapCanvas.setAttribute('arrangement', (0,_piyoppi_pico2map_ui_components__WEBPACK_IMPORTED_MODULE_0__.PickedArrangementSelector)(e.detail));
    });
    layerSelector.addEventListener('change', e => {
        if (!(e.target instanceof HTMLSelectElement))
            return;
        mapCanvas.setAttribute('activeLayer', e.target.value);
    });
    addLayerButton.addEventListener('click', () => {
        tiledMap.addLayer();
        const currentLayerIndex = tiledMap.datas.length - 1;
        layerSelector.appendChild(new Option(currentLayerIndex.toString(), currentLayerIndex.toString()));
    });
    penRadioButton.checked = true;
}
initialize();

})();

/******/ })()
;
//# sourceMappingURL=simple_map_editor.bundle.js.map
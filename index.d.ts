/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* 
    Based on the following Gecko API sources:
    * mozilla-central/devtools/client/performance-new/@types/gecko.d.ts
*/

import * as Gecko from "./lib";

interface Cc {
    "@mozilla.org/process/environment;1": {
        getService(service: Gecko.nsIEnvironment): Gecko.Environment;
    };
    "@mozilla.org/filepicker;1": {
        createInstance(instance: Gecko.nsIFilePicker): Gecko.FilePicker;
    };
}

interface Ci {
    nsIFilePicker: Gecko.nsIFilePicker;
    nsIEnvironment: Gecko.nsIEnvironment;
    nsIDocShell: Gecko.nsIDocShell;
}

declare const chrome: {
    Cc: Cc;
    Ci: Ci;
    Cu: typeof Cu;
    Services: Gecko.Services;
};

interface PathUtilsInterface {
    split: (path: string) => string[];
    isAbsolute: (path: string) => boolean;
}

declare var ChromeUtils: Gecko.ChromeUtils;

declare var PathUtils: PathUtilsInterface;

// These global objects can be used directly in JSM files only.
// In a CommonJS context you need to import them with `require("chrome")`.
declare var Cu: Ci;
declare var Cc: Cc;
declare var Ci: Ci;
declare var Services: Gecko.Services;

// Global actor modules
declare class JSWindowActorParent extends Gecko.JSWindowActorParent { }
declare class JSWindowActorChild extends Gecko.JSWindowActorChild { }

/**
 * This is a variant on the normal Document, as it contains chrome-specific properties.
 */
declare interface ChromeDocument extends Document {
    /**
     * Create a XUL element of a specific type. Right now this function
     * only refines iframes, but more tags could be added.
     */
    createXULElement: ((type: "iframe") => XULIframeElement) &
    ((type: string) => XULElement);

    /**
     * This is a fluent instance connected to this document.
     */
    l10n: Gecko.FluentLocalization;
}

/**
 * This is a variant on the HTMLElement, as it contains chrome-specific properties.
 */
declare interface ChromeHTMLElement extends HTMLElement {
    ownerDocument: ChromeDocument;
}

declare interface XULElement extends HTMLElement {
    ownerDocument: ChromeDocument;
}

declare interface XULIframeElement extends XULElement {
    contentWindow: ChromeWindow;
    src: string;
}

declare interface ChromeWindow extends Window {
    openWebLinkIn: (
        url: string,
        where: "current" | "tab" | "tabshifted" | "window" | "save",
        // TS-TODO
        params?: unknown
    ) => void;
    openTrustedLinkIn: (
        url: string,
        where: "current" | "tab" | "tabshifted" | "window" | "save",
        // TS-TODO
        params?: unknown
    ) => void;
}

declare class ChromeWorker extends Worker { }

declare interface MenuListElement extends XULElement {
    value: string;
    disabled: boolean;
}

declare interface XULCommandEvent extends Event {
    target: XULElement;
}

declare interface XULElementWithCommandHandler {
    addEventListener: (
        type: "command",
        handler: (event: XULCommandEvent) => void,
        isCapture?: boolean
    ) => void;
    removeEventListener: (
        type: "command",
        handler: (event: XULCommandEvent) => void,
        isCapture?: boolean
    ) => void;
}

declare type nsIPrefBranch = Gecko.nsIPrefBranch;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* 
    Based on the following Gecko API sources:
    * mozilla-central/devtools/client/performance-new/@types/gecko.d.ts
*/

declare namespace Gecko {
    interface Modules {
        Services: typeof import("Services");
        chrome: typeof import("chrome");
        "resource://gre/modules/AppConstants.jsm": typeof import("resource://gre/modules/AppConstants.jsm");
        "resource:///modules/CustomizableUI.jsm": typeof import("resource:///modules/CustomizableUI.jsm");
        "resource:///modules/CustomizableWidgets.jsm": typeof import("resource:///modules/CustomizableWidgets.jsm");
        "resource://devtools/shared/loader/browser-loader.js": any;
        "resource:///modules/PanelMultiView.jsm": typeof import("resource:///modules/PanelMultiView.jsm");
    }

    interface ChromeUtils {
        /**
         * Synchronously loads and evaluates the js file located at
         * 'resourceURI' with a new, fully privileged global object.
         *
         * @param resourceURI A resource:// URI string to load the module from.
         * @returns the module code's global object.
         *
         */
        import: <S extends keyof Modules>(resourceURI: S) => Modules[S];
        defineModuleGetter: (target: any, variable: string, path: string) => void;
    }

    interface MessageManager {
        loadFrameScript(url: string, flag: boolean): void;
        sendAsyncMessage: (event: string, data: any) => void;
        sendSyncMessage: (event: string, data: any) => void;
        addMessageListener: (event: string, listener: (event: any) => void) => void;
        removeMessageListener: (event: string, listener: (event: any) => void) => void;
    }

    interface Browser {
        addWebTab: (url: string, options: any) => BrowserTab;
        contentPrincipal: any;
        selectedTab: BrowserTab;
        selectedBrowser?: ChromeBrowser;
        messageManager: MessageManager;
        ownerDocument?: ChromeDocument;
    }

    interface BrowserTab {
        linkedBrowser: Browser;
    }

    interface ChromeWindow {
        gBrowser: Browser;
        focus(): void;
        openWebLinkIn(
            url: string,
            where: "current" | "tab" | "window",
            options: Partial<{
                // Not all possible options are present, please add more if/when needed.
                userContextId: number;
                forceNonPrivate: boolean;
                resolveOnContentBrowserCreated: (
                    contentBrowser: ChromeBrowser
                ) => unknown;
            }>
        ): void;
    }

    interface ChromeBrowser {
        browsingContext?: BrowsingContext;
    }

    interface BrowsingContext {
        /**
         * A unique identifier for the browser element that is hosting this
         * BrowsingContext tree. Every BrowsingContext in the element's tree will
         * return the same ID in all processes and it will remain stable regardless of
         * process changes. When a browser element's frameloader is switched to
         * another browser element this ID will remain the same but hosted under the
         * under the new browser element.
         * We are using this identifier for getting the active tab ID and passing to
         * the profiler back-end. See `getActiveBrowserID` for the usage.
         */
        browserId: number;
    }

    type GetPref<T> = (prefName: string, defaultValue?: T) => T;
    type SetPref<T> = (prefName: string, value?: T) => T;
    type nsIPrefBranch = {
        clearUserPref: (prefName: string) => void;
        getStringPref: GetPref<string>;
        setStringPref: SetPref<string>;
        getCharPref: GetPref<string>;
        setCharPref: SetPref<string>;
        getIntPref: GetPref<number>;
        setIntPref: SetPref<number>;
        getBoolPref: GetPref<boolean>;
        setBoolPref: SetPref<boolean>;
        addObserver: (
            aDomain: string,
            aObserver: PrefObserver,
            aHoldWeak?: boolean
        ) => void;
        removeObserver: (aDomain: string, aObserver: PrefObserver) => void;
    };

    type PrefObserverFunction = (
        aSubject: nsIPrefBranch,
        aTopic: "nsPref:changed",
        aData: string
    ) => unknown;
    type PrefObserver = PrefObserverFunction | { observe: PrefObserverFunction };

    interface nsIURI { }

    interface SharedLibrary {
        start: number;
        end: number;
        offset: number;
        name: string;
        path: string;
        debugName: string;
        debugPath: string;
        breakpadId: string;
        arch: string;
    }

    type Services = {
        prefs: nsIPrefBranch;
        profiler: {
            StartProfiler: (
                entryCount: number,
                interval: number,
                features: string[],
                filters?: string[],
                activeTabId?: number,
                duration?: number
            ) => void;
            StopProfiler: () => void;
            IsPaused: () => boolean;
            Pause: () => void;
            Resume: () => void;
            IsSamplingPaused: () => boolean;
            PauseSampling: () => void;
            ResumeSampling: () => void;
            GetFeatures: () => string[];
            getProfileDataAsync: (sinceTime?: number) => Promise<object>;
            getProfileDataAsArrayBuffer: (sinceTime?: number) => Promise<ArrayBuffer>;
            getProfileDataAsGzippedArrayBuffer: (
                sinceTime?: number
            ) => Promise<ArrayBuffer>;
            IsActive: () => boolean;
            sharedLibraries: SharedLibrary[];
        };
        platform: string;
        obs: {
            addObserver: (observer: object, type: string) => void;
            removeObserver: (observer: object, type: string) => void;
        };
        wm: {
            getMostRecentWindow: (name: string) => ChromeWindow;
            getMostRecentNonPBWindow: (name: string) => ChromeWindow;
        };
        focus: {
            activeWindow: ChromeWindow;
        };
        io: {
            newURI(url: string): nsIURI;
        };
        scriptSecurityManager: any;
        startup: {
            quit: (optionsBitmask: number) => void;
            eForceQuit: number;
            eRestart: number;
        };
    };

    const EventEmitter: {
        decorate: (target: object) => void;
    };

    const AppConstantsJSM: {
        AppConstants: {
            platform: string;
        };
    };

    interface BrowsingContextStub { }
    interface PrincipalStub { }

    interface WebChannelTarget {
        browsingContext: BrowsingContextStub;
        browser: Browser;
        eventTarget: null;
        principal: PrincipalStub;
    }

    const WebChannelJSM: any;

    // TS-TODO
    const CustomizableUIJSM: any;
    const CustomizableWidgetsJSM: any;
    const PanelMultiViewJSM: any;

    const LoaderJSM: {
        require: (path: string) => any;
    };

    const Services: Services;

    // This class is needed by the Cc importing mechanism. e.g.
    // Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
    class nsIFilePicker { }

    interface FilePicker {
        init: (window: Window, title: string, mode: number) => void;
        open: (callback: (rv: number) => unknown) => void;
        // The following are enum values.
        modeGetFolder: number;
        returnOK: number;
        file: {
            path: string;
        };
    }

    // This class is needed by the Cc importing mechanism. e.g.
    // Cc["@mozilla.org/process/environment;1"].getService(Ci.nsIEnvironment);
    class nsIEnvironment { }

    interface Environment {
        exists(envName: string): boolean;
        get(envName: string): string;
        set(envName: string, value: string): void;
    }

    interface Cc {
        "@mozilla.org/process/environment;1": {
            getService(service: nsIEnvironment): Environment;
        };
        "@mozilla.org/filepicker;1": {
            createInstance(instance: nsIFilePicker): FilePicker;
        };
    }

    interface Ci {
        nsIFilePicker: nsIFilePicker;
        nsIEnvironment: nsIEnvironment;
    }

    interface Cu {
        /**
         * This function reads the KnownModules and resolves which import to use.
         * If you are getting the TS2345 error:
         *
         *  Argument of type '"resource:///.../file.jsm"' is not assignable to parameter
         *  of type
         *
         * Then add the file path to the KnownModules above.
         */
        import: <S extends keyof Modules>(module: S) => Modules[S];
        exportFunction: (fn: Function, scope: object, options?: object) => void;
        cloneInto: (value: any, scope: object, options?: object) => void;
        isInAutomation: boolean;
    }

    const chrome: {
        Cc: Cc;
        Ci: Ci;
        Cu: Cu;
        Services: Services;
    };

    interface FluentLocalization {
        /**
         * This function sets the attributes data-l10n-id and possibly data-l10n-args
         * on the element.
         */
        setAttributes(
            target: Element,
            id?: string,
            args?: Record<string, string>
        ): void;
    }

    /* @todo */
    interface nsIDocShell {
        /**
         * Loads a given URI.  This will give priority to loading the requested URI
         * in the object implementing this interface.  If it can't be loaded here
         * however, the URL dispatcher will go through its normal process of content
         * loading.
         *
         * @param aLoadState This is the extended load info for this load.
         * @param aSetNavigating If we should set isNavigating to true while initiating
         *                       the load.
         */
        loadURI(aLoadState: any, aSetNavigating: boolean): void;
    }

    interface nsILoadContext {
        /**
         * associatedWindow is the window with which the load is associated, if any.
         * Note that the load may be triggered by a document which is different from
         * the document in associatedWindow, and in fact the source of the load need
         * not be same-origin with the document in associatedWindow.  This attribute
         * may be null if there is no associated window.
         */
        readonly associatedWindow?: ChromeWindow;

        /**
         * topWindow is the top window which is of same type as associatedWindow.
         * This is equivalent to associatedWindow.top, but is provided here as a
         * convenience.  All the same caveats as associatedWindow of apply, of
         * course.  This attribute may be null if there is no associated window.
         */
        readonly topWindow: ChromeWindow;

        /**
         * topFrameElement is the <iframe>, <frame>, or <browser> element which
         * contains the topWindow with which the load is associated.
         *
         * Note that we may have a topFrameElement even when we don't have an
         * associatedWindow, if the topFrameElement's content lives out of process.
         * topFrameElement is available in single-process and multiprocess contexts.
         * Note that topFrameElement may be in chrome even when the nsILoadContext is
         * associated with content.
         */
        readonly topFrameElement: Element;

        /**
         * True if the load context is content (as opposed to chrome).  This is
         * determined based on the type of window the load is performed in, NOT based
         * on any URIs that might be around.
         */
        readonly isContent: boolean;

        /*
        * Attribute that determines if private browsing should be used. May not be
        * changed after a document has been loaded in this context.
        */
        usePrivateBrowsing: boolean;

        /**
        * Attribute that determines if remote (out-of-process) tabs should be used.
        */
        readonly useRemoteTabs: boolean;

        /**
        * Determines if out-of-process iframes should be used.
        */
        readonly useRemoteSubframes: boolean;

        /*
        * Attribute that determines if tracking protection should be used. May not be
        * changed after a document has been loaded in this context.
        */
        useTrackingProtection: boolean;
    }

    interface FrameLoader {
        /**
         * Get the docshell from the frame loader.
         */
        readonly docShell?: nsIDocShell;

        /**
         * Get this frame loader's RemoteTab, if it has a remote frame.  Otherwise,
         * returns null.
         */
        readonly remoteTab?: any;

        /**
         * Get an nsILoadContext for the top-level docshell. For remote
         * frames, a shim is returned that contains private browsing and app
         * information.
         */
        readonly loadContext: nsILoadContext;

        /**
         * Get the root BrowsingContext within the frame.
         * This may be null immediately after creating a remote frame.
         */
        readonly browsingContext?: BrowsingContext;

        /**
         * Find out whether the loader's frame is at too great a depth in
         * the frame tree.  This can be used to decide what operations may
         * or may not be allowed on the loader's docshell.
         */
        readonly depthTooGreat: boolean;

        /**
         * Find out whether the loader's frame is a remote frame.
         */
        readonly isRemoteFrame: boolean;

        /**
         * Activate event forwarding from client (remote frame) to parent.
         */
        activateFrameEvent(aType: string, capture: boolean): void;

        // Note, when frameloaders are swapped, also messageManagers are swapped.
        readonly messageManager: any;

        /**
         * Force a remote browser to recompute its dimension and screen position.
         */
        requestUpdatePosition(): void;

        /**
         * Force a TabStateFlush from native sessionStoreListeners.
         * Returns a promise that resolves when all session store data has been
         * flushed.
         */
        requestTabStateFlush(): Promise<void>;

        /**
         * Force Epoch update in native sessionStoreListeners.
         */
        requestEpochUpdate(aEpoch: number): void;

        /**
         * Request a session history update in native sessionStoreListeners.
         */
        requestSHistoryUpdate(): void;

        /**
         * Creates a print preview document in this frame, or updates the existing
         * print preview document with new print settings.
         *
         * @param aPrintSettings The print settings to use to layout the print
         *   preview document.
         * @param aSourceBrowsingContext Optionally, the browsing context that
         *   contains the document from which the print preview is to be generated,
         *   which must be in the same process as the browsing context of the frame
         *   loader itself.
         *
         *   This should only be passed on the first call.  It should not be passed
         *   for any subsequent calls that are made to update the existing print
         *   preview document with a new print settings object.
         * @return A Promise that resolves with a PrintPreviewSuccessInfo on success.
         */
        printPreview(aPrintSettings: any, aSourceBrowsingContext?: BrowsingContext): Promise<number>;

        /**
         * Inform the print preview document that we're done with it.
         */
        exitPrintPreview(): void;

        /**
         * The element which owns this frame loader.
         *
         * For example, if this is a frame loader for an <iframe>, this attribute
         * returns the iframe element.
         */
        readonly ownerElement?: Element;


        /**
         * Cached childID of the ContentParent owning the RemoteTab in this frame
         * loader. This can be used to obtain the childID after the RemoteTab died.
         */
        readonly childID: number;

        /**
         * Find out whether the owner content really is a mozbrowser. <xul:browser>
         * is not considered to be a mozbrowser frame.
         */
        readonly ownerIsMozBrowserFrame: boolean;

        /**
         * The last known width of the frame. Reading this property will not trigger
         * a reflow, and therefore may not reflect the current state of things. It
         * should only be used in asynchronous APIs where values are not guaranteed
         * to be up-to-date when received.
         */
        readonly lazyWidth: number;

        /**
         * The last known height of the frame. Reading this property will not trigger
         * a reflow, and therefore may not reflect the current state of things. It
         * should only be used in asynchronous APIs where values are not guaranteed
         * to be up-to-date when received.
         */
        readonly lazyHeight: number;

        /**
         * Is `true` if the frameloader is dead (destroy has been called on it)
         */
        readonly isDead: boolean;
    }

    interface WindowGlobalChild {
        new(): {
            readonly isClosed: boolean;
            readonly isInProcess: boolean;
            readonly browsingContext: BrowsingContext;
            readonly windowContext: any;
          
            readonly isCurrentGlobal: boolean;
          
            readonly innerWindowId: number;
            readonly outerWindowId: number;
            readonly contentParentId: number;
          
            // A WindowGlobalChild is the root in its process if it has no parent, or its
            // embedder is in a different process.
            readonly isProcessRoot: boolean;
          
            // Is this WindowGlobalChild same-origin with `window.top`?
            readonly sameOriginWithTop: boolean;
          
            readonly parentActor?: WindowGlobalParent; // in-process only
          
            /**
             * Get or create the JSWindowActor with the given name.
             *
             * See WindowActorOptions from JSWindowActor.webidl for details on how to
             * customize actor creation.
             */
            getActor(name: string): JSWindowActorChild;
            getExistingActor(name: string): JSWindowActorChild | null;
        }

        getByInnerWindowId(innerWindowId: number): WindowGlobalChild | null;
    }

    interface WindowGlobalParent {
        new(): {
            readonly isClosed: boolean;
            readonly isCurrentGlobal: boolean;
            readonly outerWindowId: number;
            readonly contentParentId: number;
            readonly osPid: number;
            readonly isProcessRoot: boolean;
            readonly isInitialDocument: boolean;
            readonly rootFrameLoader?: FrameLoader;
            readonly childActor?: WindowGlobalChild;

            /** 
             * Checks for any WindowContexts with "beforeunload" listeners in this
             * WindowGlobal's subtree. If any exist, a "beforeunload" event is
             * dispatched to them. If any of those request to block the navigation,
             * displays a prompt to the user. Returns a boolean which resolves to true
             * if the navigation should be allowed.
             *
             * If `timeout` is greater than 0, it is the maximum time (in milliseconds)
             * we will wait for a child process to respond with a request to block
             * navigation before proceeding. If the user needs to be prompted, however,
             * the promise will not resolve until the user has responded, regardless of
             * the timeout.
             */
            permitUnload(action?: "prompt" | "dontUnload" | "unload", timeout?: number): Promise<boolean>;

            readonly documentPrincipal: any;
            readonly documentStoragePrincipal: any;
            readonly contentBlockingAllowListPrincipal?: any;
            readonly documentURI?: URL;
            readonly documentTitle: string;
            readonly cookieJarSettings?: any; /* @todo */
        
            // Bit mask containing content blocking events that are recorded in
            // the document's content blocking log.
            readonly contentBlockingEvents: number;
        
            // String containing serialized content blocking log.
            readonly contentBlockingLog: string;
        
            // DOM Process which this window was loaded in. Will be either InProcessParent
            // for windows loaded in the parent process, or ContentParent for windows
            // loaded in the content process.
            readonly domProcess?: any;

            /**
             * Get or create the JSWindowActor with the given name.
             *
             * See WindowActorOptions from JSWindowActor.webidl for details on how to
             * customize actor creation.
             */
            getActor(name: string): JSWindowActorParent;
            getExistingActor(name: string): JSWindowActorParent | null;
        
            /**
             * Renders a region of the frame into an image bitmap.
             *
             * @param rect Specify the area of the document to render, in CSS pixels,
             * relative to the page. If null, the currently visible viewport is rendered.
             * @param scale The scale to render the window at. Use devicePixelRatio
             * to have comparable rendering to the OS.
             * @param backgroundColor The background color to use.
             * @param resetScrollPosition If true, temporarily resets the scroll position
             * of the root scroll frame to 0, such that position:fixed elements are drawn
             * at their initial position. This parameter only takes effect when passing a
             * non-null rect.
             *
             * This API can only be used in the parent process, as content processes
             * cannot access the rendering of out of process iframes. This API works
             * with remote and local frames.
             */
            drawSnapshot(
                rect?: DOMRect,
                scale?: number,
                backgroundColor?: string,
                resetScrollPosition?: boolean
            ): Promise<ImageBitmap>
        
            /**
             * Fetches the securityInfo object for this window. This function will
             * look for failed and successful channels to find the security info,
             * thus it will work on regular HTTPS pages as well as certificate
             * error pages.
             *
             * This returns a Promise which resolves to an nsITransportSecurity
             * object with certificate data or undefined if no security info is available.
             */
            getSecurityInfo(): Promise<any> /* @todo */;
        
            // True if any of the windows in the subtree rooted at this window
            // has active peer connections.  If this is called for a non-top-level
            // context, it always returns false.
            hasActivePeerConnections(): boolean;
        }
      
        getByInnerWindowId(innerWindowId: number): WindowGlobalParent | null;
    }

    class JSActor {
        sendAsyncMessage(messageName: string, obj?: any): void;
    
        sendQuery(messageName: string, obj?: any): Promise<any>;
    
        readonly name: string;
    }

    /**
     * An actor architecture designed to allow compositional parent/content
     * communications. The lifetime of a JSWindowActor{Child, Parent} is the `WindowGlobalParent`
     * (for the parent-side) / `WindowGlobalChild` (for the child-side).
     *
     * See https://firefox-source-docs.mozilla.org/dom/ipc/jsactors.html for
     * more details on how to use this architecture.
     */
     class JSWindowActorParent extends JSActor {
        /**
         * Actor initialization occurs after the constructor is called but before the
         * first message is delivered. Until the actor is initialized, accesses to
         * manager will fail.
         */
        readonly manager?: WindowGlobalParent;
      
        /**
         * The WindowContext associated with this JSWindowActorParent. For
         * JSWindowActorParent this is identical to `manager`, but is also exposed as
         * `windowContext` for consistency with `JSWindowActorChild`. Until the actor
         * is initialized, accesses to windowContext will fail.
         */
        readonly windowContext?: any;
      
        readonly browsingContext?: BrowsingContext;
    }

    /**
     * An actor architecture designed to allow compositional parent/content
     * communications. The lifetime of a JSWindowActor{Child, Parent} is the `WindowGlobalParent`
     * (for the parent-side) / `WindowGlobalChild` (for the child-side).
     *
     * See https://firefox-source-docs.mozilla.org/dom/ipc/jsactors.html for
     * more details on how to use this architecture.
     */
    class JSWindowActorChild extends JSActor {
        /**
         * Actor initialization occurs after the constructor is called but before the
         * first message is delivered. Until the actor is initialized, accesses to
         * manager will fail.
         */
        readonly manager?: WindowGlobalChild;
      
        /**
         * The WindowContext associated with this JSWindowActorChild. Until the actor
         * is initialized, accesses to windowContext will fail.
         */
        readonly windowContext?: any;
      
        readonly document?: Document;
      
        readonly browsingContext?: BrowsingContext;
      
        readonly docShell?: nsIDocShell;
      
        /**
         * NOTE: As this returns a window proxy, it may not be currently referencing
         * the document associated with this JSWindowActor. Generally prefer using
         * `document`.
         */
        readonly contentWindow?: Window;
    }
}

interface PathUtilsInterface {
    split: (path: string) => string[];
    isAbsolute: (path: string) => boolean;
}

declare module "Services" {
    export = Gecko.Services;
}

declare module "chrome" {
    export = Gecko.chrome;
}

declare module "ChromeUtils" {
    export = ChromeUtils;
}

declare module "resource://gre/modules/AppConstants.jsm" {
    export = Gecko.AppConstantsJSM;
}

declare module "resource://gre/modules/WebChannel.jsm" {
    export = Gecko.WebChannelJSM;
}

declare module "resource:///modules/CustomizableUI.jsm" {
    export = Gecko.CustomizableUIJSM;
}

declare module "resource:///modules/CustomizableWidgets.jsm" {
    export = Gecko.CustomizableWidgetsJSM;
}

declare module "resource:///modules/PanelMultiView.jsm" {
    export = Gecko.PanelMultiViewJSM;
}

declare var ChromeUtils: Gecko.ChromeUtils;

declare var PathUtils: PathUtilsInterface;

// These global objects can be used directly in JSM files only.
// In a CommonJS context you need to import them with `require("chrome")`.
declare var Cu: Gecko.Cu;
declare var Cc: Gecko.Cc;
declare var Ci: Gecko.Ci;
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

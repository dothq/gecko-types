/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { ChromeWindow } from "./ChromeWindow";
import { nsIPrefBranch } from "./nsIPrefBranch";
import { nsIURI } from "./nsIURI";
import { SharedLibrary } from "./SharedLibrary";

export type Services = {
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
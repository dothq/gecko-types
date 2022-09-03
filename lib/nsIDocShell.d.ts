/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

export interface nsIDocShell {
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
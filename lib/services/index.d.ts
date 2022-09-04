/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

import { nsIPrefBranch } from "../nsIPrefBranch";
import { ServicesFocus } from "./focus";
import { ServicesIo } from "./io";
import { ServicesObs } from "./obs";
import { ServicesPolicies } from "./policies";
import { ServicesProfiler } from "./profiler";
import { ServicesSearch } from "./search";
import { ServicesStartup } from "./startup";
import { ServicesWm } from "./wm";
 
export type Services = {
    prefs: nsIPrefBranch;
    profiler: ServicesProfiler;
    obs: ServicesObs;
    wm: ServicesWm;
    focus: ServicesFocus;
    io: ServicesIo;
    policies: ServicesPolicies;
    scriptSecurityManager: any;
    search: ServicesSearch;
    startup: ServicesStartup;
 };
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";

/*

?loglevel=info

import { ConsoleService } from 'ejflab-front-lib';

constructor(
    private consoleSrv: ConsoleService
) {
    this.consoleSrv.info("This is an info...");
    this.consoleSrv.warning("This is an warning...");
    this.consoleSrv.error("This is an error...");  
}


*/
@Injectable({
    providedIn: 'root',
})
export class ConsoleService {
    static traceMiddleware: { [key: string]: Function };
    constructor(
        private configService: ConfigService,
    ) {

    }
    static setTraceErrorMiddleware(key: string, extra: Function) {
        ConsoleService.traceMiddleware[key] = extra;
    }
    info(...args: any) {
        this.log(...args);
    }
    log(...args: any) {
        const level = this.configService.getLogLevel();
        if (["info"].indexOf(level) >= 0) {
            console.log(...args);
        }
    }
    warn(...args: any) {
        this.warning(...args);
    }
    warning(...args: any) {
        const level = this.configService.getLogLevel();
        if (["warning", "info"].indexOf(level) >= 0) {
            console.warn(...args);
        }
        for (let key in ConsoleService.traceMiddleware) {
            if (typeof ConsoleService.traceMiddleware[key] == "function") {
                ConsoleService.traceMiddleware[key](key, "warning", ...args);
            }
        }
    }
    error(...args: any) {
        const level = this.configService.getLogLevel();
        if (["error", "warning", "info"].indexOf(level) >= 0) {
            console.error(...args);
        }
        for (let key in ConsoleService.traceMiddleware) {
            if (typeof ConsoleService.traceMiddleware[key] == "function") {
                ConsoleService.traceMiddleware[key](key, "error", ...args);
            }
        }
    }
}
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";

/*
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
    constructor(
        private configService: ConfigService,
    ) {

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
    warning(...args: any) {
        const level = this.configService.getLogLevel();
        if (["warning", "info"].indexOf(level) >= 0) {
            console.warn(...args);
        }
    }
    error(...args: any) {
        const level = this.configService.getLogLevel();
        if (["error", "warning", "info"].indexOf(level) >= 0) {
            console.error(...args);
        }
    }
}
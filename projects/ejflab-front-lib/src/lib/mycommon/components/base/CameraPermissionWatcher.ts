export type PermissionVideoStateType = "granted" | "denied" | "prompt";

export class CameraPermissionWatcher {
    private status: PermissionVideoStateType | null = null;
    private listeners: ((state: PermissionVideoStateType) => void)[] = [];

    constructor() {
        this.init();
    }

    private async init() {
        let hasPermissionAPI = false;
        if ("permissions" in navigator && navigator.permissions.query) {
            hasPermissionAPI = true;
            try {
                const perm = await navigator.permissions.query({ name: "camera" as PermissionName });

                this.status = perm.state as PermissionVideoStateType;
                this.notify(this.status);

                // Listen for changes (works in Chrome, Edge, Firefox)
                perm.onchange = () => {
                    this.status = perm.state as PermissionVideoStateType;
                    this.notify(this.status);
                };

                return;
            } catch {
                console.warn("Permissions API not supported for camera.");
            }
        }

        // Fallback for Safari: no Permissions API → detect only when requesting
        this.tryGetUserMedia();
        /*
        if (!hasPermissionAPI) {
            const MAX_COUNT = 30 * 1;//1 minute
            let counter = 2;
            const repeatedFunction = () => {
                setTimeout(async () => {
                    await this.tryGetUserMedia();
                    if (counter < MAX_COUNT) {
                        counter++;
                        repeatedFunction();
                    }
                }, 3000);
            };
            repeatedFunction();
        }
        */
    }

    private async tryGetUserMedia() {
        let status: PermissionVideoStateType | null = null;
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            status = "granted";
        } catch (err: any) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                status = "denied";
            } else {
                status = "prompt"; // e.g., before user decides
            }
        }
        /*
        if (status != this.status) {
            this.status = status;
            this.notify(this.status);
        }
        */
        this.status = status;
        this.notify(this.status);
    }

    onChange(callback: (state: PermissionVideoStateType) => void) {
        this.listeners.push(callback);
        if (this.status) callback(this.status); // fire immediately with current status
    }

    private notify(state: PermissionVideoStateType) {
        this.listeners.forEach(cb => cb(state));
    }
}

import { Injectable } from "@angular/core";
import { PromiseEmitter } from '../components/base/PromiseEmitter';

@Injectable({
    providedIn: 'root'
})
export class AudioService {

    static audioContext: AudioContext | null = null;
    static promise = new PromiseEmitter();

    constructor() { }

    static async createSafeAudioContext() {
        if (!AudioService.audioContext) {
            AudioService.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (AudioService.audioContext.state === 'suspended') {
            await AudioService.audioContext.resume();
        }
        AudioService.promise.resolve(AudioService.audioContext);
    }

    static async getAudioContext(): Promise<AudioContext> {
        return AudioService.promise.promise;
    }
}
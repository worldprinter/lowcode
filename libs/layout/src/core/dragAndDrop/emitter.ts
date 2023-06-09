import type { Emitter } from 'mitt'
import mitt from 'mitt'

export class DEmitter<T extends Record<string, unknown> = any> {
    emitter: Emitter<T>

    constructor() {
        this.emitter = mitt()
    }
}

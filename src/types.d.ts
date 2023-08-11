declare module 'uuid' {
    export function v1(options?: {
        node?: number[]
        clockSeq?: number
        msecs?: number
        nsecs?: number
    }): string
    export function v3(options: {
        namespace: string | Buffer
        name: string | Buffer
    }): string
    export function v4(options?: {
        random?: number[]
        rng?: () => number[]
    }): string
    export function v5(options: {
        namespace: string | Buffer
        name: string | Buffer
    }): string
    export function parse(uuid: string): Buffer
    export function unparse(buffer: Buffer): string
}

declare module 'react-pdf'
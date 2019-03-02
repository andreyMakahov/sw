export interface ConfigInterface {
    prefix?: string,

    suffix?: string,

    precache?: string,

    runtime?: string,

    debug?: boolean,
}

export interface CacheInterface {
    precache: Array<string>,
}

export interface PrecacheInterface {
    precache: Array<string>,
}

import * as Promise from 'bluebird';
import autobind from 'autobind-decorator';
import Logger from './Logger/index';

import {
    DEFAULT_PREFIX,
    DEFAULT_SUFFIX,
    DEFAULT_PRECACHE_NAME,
    DEFAULT_RUNTIME_NAME,
    DEFAULT_DEBUG_VALUE,
    Modes,
} from './constants';

import {
    ConfigInterface,
    CacheInterface,
    PrecacheInterface,
} from './interfaces';

import { Types } from './Logger/constants';

class ServiceWorker {

    prefix: string;

    suffix: string;

    precacheName: string;

    runtimeName: string;

    mode: string;

    cache: PrecacheInterface;

    logger: Logger;

    constructor(
        config: ConfigInterface,
        cache: CacheInterface,
    ) {
        this.prefix = config.prefix || DEFAULT_PREFIX;
        this.suffix = config.suffix || DEFAULT_SUFFIX;
        this.precacheName = config.precache || DEFAULT_PRECACHE_NAME;
        this.runtimeName = config.runtime || DEFAULT_RUNTIME_NAME;

        const debug = config.debug || DEFAULT_DEBUG_VALUE;
        this.mode = debug ? Modes.Development : Modes.Production;
        this.logger = new Logger(this.mode);

        this.cache = {
            precache: cache.precache,
        };


        this.bindEventListeners();
    }

    @autobind
    onInstall(event: any): void {
        event.waitUntil(
            caches.open(this.precacheName).then((cache) => {
                return cache.addAll(this.cache.precache);
            })
        );
    }

    @autobind
    onActivate(event: any): void {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => false)
                        .map((cacheName) => caches.delete(cacheName))
                )
            })
        )
    }

    @autobind
    onFetch(event: any): void {
        const request = event.request;

        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    this.logger.report('Found response in cache', Types.Info);

                    return response;
                }
                this.logger.report('No response found in cache. About to fetch from network...', Types.Info);

                return fetch(request).then(function(response) {
                    console.log('Response from network is:', response);

                    return response;
                }).catch(function(error) {
                    console.error('Fetching failed:', error);

                    throw error;
                });
            })
        );
    }

    bindEventListeners() {
        self.addEventListener('install', this.onInstall);
        self.addEventListener('activate', this.onActivate);
        self.addEventListener('fetch', this.onFetch);
    }
}

export default ServiceWorker;
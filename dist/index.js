var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as Promise from 'bluebird';
import autobind from 'autobind-decorator';
import Logger from './Logger/index';
import { DEFAULT_PREFIX, DEFAULT_SUFFIX, DEFAULT_PRECACHE_NAME, DEFAULT_RUNTIME_NAME, DEFAULT_DEBUG_VALUE, Modes, } from './constants';
import { Types } from './Logger/constants';
var ServiceWorker = /** @class */ (function () {
    function ServiceWorker(config, cache) {
        this.prefix = config.prefix || DEFAULT_PREFIX;
        this.suffix = config.suffix || DEFAULT_SUFFIX;
        this.precacheName = config.precache || DEFAULT_PRECACHE_NAME;
        this.runtimeName = config.runtime || DEFAULT_RUNTIME_NAME;
        var debug = config.debug || DEFAULT_DEBUG_VALUE;
        this.mode = debug ? Modes.Development : Modes.Production;
        this.logger = new Logger(this.mode);
        this.cache = {
            precache: cache.precache,
        };
        this.bindEventListeners();
    }
    ServiceWorker.prototype.onInstall = function (event) {
        var _this = this;
        event.waitUntil(caches.open(this.precacheName).then(function (cache) {
            return cache.addAll(_this.cache.precache);
        }));
    };
    ServiceWorker.prototype.onActivate = function (event) {
        event.waitUntil(caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames
                .filter(function (cacheName) { return false; })
                .map(function (cacheName) { return caches.delete(cacheName); }));
        }));
    };
    ServiceWorker.prototype.onFetch = function (event) {
        var _this = this;
        var request = event.request;
        this.logger.report("Request: " + request.url, Types.Info);
        event.respondWith(caches.match(request).then(function (response) {
            if (response) {
                _this.logger.report('Found response in cache', Types.Info);
                return response;
            }
            _this.logger.report('No response found in cache. About to fetch from network...', Types.Info);
            return fetch(request).then(function (response) {
                console.log('Response from network is:', response);
                return response;
            }).catch(function (error) {
                console.error('Fetching failed:', error);
                throw error;
            });
        }));
    };
    ServiceWorker.prototype.bindEventListeners = function () {
        self.addEventListener('install', this.onInstall);
        self.addEventListener('activate', this.onActivate);
        self.addEventListener('fetch', this.onFetch);
    };
    __decorate([
        autobind
    ], ServiceWorker.prototype, "onInstall", null);
    __decorate([
        autobind
    ], ServiceWorker.prototype, "onActivate", null);
    __decorate([
        autobind
    ], ServiceWorker.prototype, "onFetch", null);
    return ServiceWorker;
}());
export default ServiceWorker;
//# sourceMappingURL=index.js.map
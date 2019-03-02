self.importScripts('../dist/bundle.js');

if (SwToolbox) {
    var config = {
        prefix: 'demo-app',

        suffix: 'v1',

        precache: 'precache',

        runtime: 'runtime',

        debug: true
    };

    var cache = {
        precache: [
            'https://andreymakahov.github.io/sw/static/main.css'
        ]
    };

    new SwToolbox(config, cache);
}
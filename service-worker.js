const CACHE_NAME = "sonido-chicago-v3";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./estilos.css",
    "./app.js",
    "./manifest.json",
    "./logo.png",
    "./icon-192.png",
    "./icon-512.png",
    "./fuentes/ethnocentric%20rg.ttf"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ARCHIVOS);
            })
    );

});

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(nombres => {

            return Promise.all(
                nombres
                    .filter(nombre => nombre !== CACHE_NAME)
                    .map(nombre => caches.delete(nombre))
            );

        })
    );

});

self.addEventListener("fetch", event => {

    event.respondWith(
        caches.match(event.request)
            .then(respuesta => {
                return respuesta || fetch(event.request);
            })
    );

});
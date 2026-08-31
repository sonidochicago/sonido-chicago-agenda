const CACHE_NAME = "sonido-chicago-v2";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./estilos.css",
    "./app.js",
    "./manifest.json",
    "./logo.png",
    "./icon-192.png",
    "./icon-512.png",
    "./fuentes/Ethnocentric.ttf"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ARCHIVOS);
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
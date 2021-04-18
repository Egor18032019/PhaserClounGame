const staticCacheName = `s-phaser-cloun-7`;
const dynamicCacheName = `d-phaser-cloun-7`;
let filesToCache = [
  `game.html`,
  `offline.html`,
  `/assets/grid1.csv`,
  `/assets/drawtiles1.png`,
  `/assets/star.png`,
  `/assets/bomb.png`,
  `/assets/RPG_assets.png`,
];


self.addEventListener(`install`, function (event) {
  console.log(`установка sw`);

  event.waitUntil( // определяем успешность установки.
    caches.open(staticCacheName).then(function (cache) {
      // Этот метод берет имя кеша, который вы хотите открыть (cacheName) и возвращает промис, который будет преобразован в объект кеша, хранящийся в браузере пользователя.
      console.log(`sw кеширует файлы`);
      return cache.addAll(filesToCache);
    })
    .catch(function (err) {
      console.log(err);
      // если какой-либо из файлов не загружается в кеш, весь этап установки завершится неудачно.
    })

  );

});

self.addEventListener(`activate`, async (event) => {
  console.log(`activate sw`);
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames
    .filter((name) => name !== staticCacheName)
    .filter((name) => name !== dynamicCacheName)
    .map((name) => {
      caches.delete(name);
      console.log(cacheNames);  
    })
    // убираю нужное и удалю все ненужное
  );
});

self.addEventListener(`fetch`, (event) => {
  // Это событие вызывается каждый раз, когда делается запрос,
  //  который входит в область видимости нашего Service Worker.
  console.log(`fetch sw`);
  const {
    request
  } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || await fetch(request);
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName);
  try {
    const response = await fetch(request);
    await cache.put(request, response.clone());
    return response;
  } catch (e) {
    const cached = await cache.match(request);
    return cached || await caches.match(`offline.html`);
  }
}
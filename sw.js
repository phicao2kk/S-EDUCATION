// 1. Mỗi khi bạn sửa code HTML/CSS, hãy tăng số version này lên (v1 -> v2)
const CACHE_NAME = 's-education-v2'; 
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// Cài đặt và ép Service Worker mới kích hoạt ngay lập tức
self.addEventListener('install', e => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Dọn dẹp cache cũ khi phiên bản mới (v2, v3...) được cài đặt
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Chiến lược: Network First (Lấy mới trước, dự phòng cache sau)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});

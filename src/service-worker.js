/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files  // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});

// Push Notification Handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'You have a new message!',
    icon: '/logo.png', // Adjust to your app's icon
    badge: '/logo.png', // Optional badge icon
    vibrate: [100, 50, 100], // Haptic feedback
    data: { url: event.data?.json()?.url || '/' }, // Custom data, e.g., link to specific page like '/community/quiz/123'
    actions: [
      { action: 'view', title: 'View Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification("GKSS-Portal", options) // Replace 'Your App Name' with your app title
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Extract URL from data or default
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window is open, focus it and navigate
        const client = clientList.find(client => client.url.includes(urlToOpen) && 'focus' in client);
        if (client) {
          return client.focus().then(() => {
            if (client.url !== urlToOpen) {
              return client.navigate(urlToOpen);
            }
          });
        }
        
        // Otherwise, open a new window/tab
        if (client.openWindow) {
          return client.openWindow(urlToOpen);
        }
      })
  );
});


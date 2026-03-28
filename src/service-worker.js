/* eslint-disable no-restricted-globals */
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

// Precache assets
precacheAndRoute(self.__WB_MANIFEST);

// Example of runtime caching for API requests
registerRoute(
	({ request }) =>
		request.destination === 'script' || request.destination === 'style',
	new StaleWhileRevalidate()
);
/* eslint-enable no-restricted-globals */

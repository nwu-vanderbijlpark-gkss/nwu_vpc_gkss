import { sendBrowserNotification } from '$lib';
import { writable } from 'svelte/store';

function createNotificationStore() {
    const { subscribe, update } = writable([]);

    return {
        subscribe,
        add: (notification) => {
            update(n => {
                const newNotification = {
                    ...notification,
                    id: Date.now()
                };
                return [...n, newNotification];
            });
            //add browser notification
        },
        remove: (id) => {
            update(n => n.filter(notification => notification.id !== id));
        }
    };
}
export const audioStore = (() => {
    const { subscribe, set } = writable(null);
    
    return {
      subscribe,
      playSound: (url) => set(`${url}?t=${Date.now()}`) // Timestamp forces reload
    };
  })();
  
export const notifications = createNotificationStore();
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
        },
        remove: (id) => {
            update(n => n.filter(notification => notification.id !== id));
        }
    };
}

export const notifications = createNotificationStore();
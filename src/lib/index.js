
export const uploadImage = async (file,folder, supabase) => {
        try {
            const fileName = `images/${folder}/${Date.now()}-${file.name}`;
            const { error } = await supabase.storage.from('files').upload(fileName, file);

            if (error) throw error;

            const {
                data: { publicUrl }
            } = supabase.storage.from('files').getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            return null;
        }
    };

export function getRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		let r, g, b, luminance;

		do {
			color = '#';
			for (let i = 0; i < 6; i++) {
				color += letters[Math.floor(Math.random() * 16)];
			}

			// Convert hex to RGB
			r = parseInt(color.slice(1, 3), 16);
			g = parseInt(color.slice(3, 5), 16);
			b = parseInt(color.slice(5, 7), 16);

			// Calculate luminance
			luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

			// Keep looping until we get a dark color (luminance threshold can be adjusted)
		} while (luminance > 128); // 0-255 scale, lower is darker

		return color;
	}

export function requestNotificationPermission() {
	if ('Notification' in window) {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
			}
		});
	}
}

// Send browser notification
export function sendBrowserNotification(title, options) {
	if ('Notification' in window && Notification.permission === 'granted') {
		new Notification(title, options);
	}
}


//TODO
const registration = await navigator.serviceWorker.getRegistration();

const base64UrlToUint8Array = base64UrlData => {
  const padding = '='.repeat((4 - base64UrlData.length % 4) % 4);
  const base64 = (base64UrlData + padding)
  .replace(/-/g, '+')
  .replace(/_/g, '/');

  const rawData = atob(base64);
  const buffer = new Uint8Array(rawData.length);

  for(let i = 0; i < rawData.length; ++i) {
    buffer[i] = rawData.charCodeAt(i);
  }

  return buffer;
};

const subscribeToPushMessages = (registration, publicKey) => registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: base64UrlToUint8Array(publicKey)
});

const unsubscribeFromPushMessages = subscription => subscription.unsubscribe();

const getPushSubscription = () => registration.pushManager.getSubscription();

const apiUrl = '...';
const sendPushMessage = async ({title, message, delay, interaction}) => {
  const pushSubscription = await getPushSubscription();
  const delayTime = !Number.isInteger(parseInt(delay, 10)) ? 0 :
    delay > 5 ? 5 : delay;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pushSubscription,
      title,
      message,
      delay: delayTime * 1000,
      interaction
    })
  });
};
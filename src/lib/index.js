
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


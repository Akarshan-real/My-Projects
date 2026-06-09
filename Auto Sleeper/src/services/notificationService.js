const { Notification } = require('electron');

class NotificationService {
    showNotification(title, body) {
        if (Notification.isSupported()) {
            const notification = new Notification({
                title: title,
                body: body,
                silent: false,
                icon: undefined // Optional: Add a path to an icon later
            });
            notification.show();
        } else {
            console.warn('Notifications are not supported on this system.');
        }
    }
}

module.exports = new NotificationService();

import { toast } from 'react-toastify';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

class PushNotificationService {
  private vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
  private serviceWorkerPath = '/service-worker.js';
  private registration: ServiceWorkerRegistration | null = null;

  async initialize() {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported');
      }

      this.registration = await navigator.serviceWorker.register(this.serviceWorkerPath);
      
      // Handle incoming messages from service worker
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage);
      
      return this.registration;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      throw error;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await this.subscribeToPush();
    }
    return permission;
  }

  private async subscribeToPush() {
    try {
      if (!this.registration) {
        await this.initialize();
      }

      const subscription = await this.registration!.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey!)
      });

      await this.sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('Failed to subscribe to push:', error);
      throw error;
    }
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }

  private handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, payload } = event.data;

    switch (type) {
      case 'PLAYLIST_COLLABORATION':
        toast.info(`${payload.username} wants to collaborate on "${payload.playlistName}"`);
        break;
      case 'NEW_TRACK_ADDED':
        toast.success(`New track added to "${payload.playlistName}"`);
        break;
      case 'PLAYLIST_SHARED':
        toast.info(`${payload.username} shared "${payload.playlistName}" with you`);
        break;
      // Add more notification types as needed
    }
  };

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();

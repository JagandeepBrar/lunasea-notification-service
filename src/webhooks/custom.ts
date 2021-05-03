import { NotificationPayload } from '../payloads';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Given the request data body, execute the correct webhook handler for a custom notification.
 *
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 */
export const handleWebhook = async (data: any, devices: string[]): Promise<void> => {
    Logger.debug('-> Preparing payload...');
    const payload = <NotificationPayload>{
        title: data?.title ?? 'Unknown Title',
        body: data?.body ?? 'Unknown Content',
        image: data?.image,
    };
    await Firebase.sendNotification(devices, payload);
};

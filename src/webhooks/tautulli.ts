import * as Models from '../models/tautulli';
import { NotificationPayload } from '../payloads';
import * as Payloads from '../payloads/tautulli';
import { Firebase } from '../utilities/firebase';
import { Logger } from '../utilities/logger';

/**
 * Given the request data body, execute the correct webhook handler for Tautulli.
 *
 * @param data Webhook notification payload
 * @param devices List of devices to send the notification to
 * @param profile The profile name to attach to the title
 */
export const handleWebhook = async (data: any, devices: string[], profile: string): Promise<void> => {
    Logger.debug('-> Preparing payload...');
    let payload: NotificationPayload;
    switch (data.event_type) {
        case Models.EventType.PlaybackError:
            Logger.debug('-> Handling as "PlaybackStop" event type...');
            payload = await Payloads.playbackErrorPayload(data as Models.PlaybackErrorEventType, profile);
            break;
        case Models.EventType.PlaybackPause:
            Logger.debug('-> Handling as "PlaybackPause" event type...');
            payload = await Payloads.playbackPausePayload(data as Models.PlaybackPauseEventType, profile);
            break;
        case Models.EventType.PlaybackResume:
            Logger.debug('-> Handling as "PlaybackResume" event type...');
            payload = await Payloads.playbackResumePayload(data as Models.PlaybackPauseEventType, profile);
            break;
        case Models.EventType.PlaybackStart:
            Logger.debug('-> Handling as "PlaybackStart" event type...');
            payload = await Payloads.playbackStartPayload(data as Models.PlaybackPauseEventType, profile);
            break;
        case Models.EventType.PlaybackStop:
            Logger.debug('-> Handling as "PlaybackStop" event type...');
            payload = await Payloads.playbackStopPayload(data as Models.PlaybackPauseEventType, profile);
            break;
        case Models.EventType.TranscodeDecisionChange:
            Logger.debug('-> Handling as "TranscodeDecisionChange" event type...');
            payload = await Payloads.transcodeDecisionChangePayload(data as Models.TranscodeDecisionChangeEventType, profile);
            break;
        default:
            Logger.warn('-> An unknown eventType was received:', data);
            Logger.warn('-> Failed to send to device(s).');
            return;
    }
    await Firebase.sendNotification(devices, payload);
};

import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import envVars from '../config/env';


export interface PushNotification {
    body: string;
    title: string;
    data?: Record<string, any>;
    sound?: string;
}

@Injectable()
export class PushNotificationsService {
    private expo = new Expo({
        accessToken: envVars.EXPO_ACCESS_TOKEN,
        useFcmV1: true,
    });

    sendNotification(toTokens: string[], notification: PushNotification) {
        const areExpoTokens = toTokens.every(Expo.isExpoPushToken);

        if (!areExpoTokens) {
            throw new BadRequestException('Invalid expo push tokens');
        }

        const messages: ExpoPushMessage[] = toTokens.map((token) => ({
            to: token,
            sound: notification.sound || 'default',
            body: notification.body,
            title: notification.title,
            data: notification.data,
        }));

        const chunks = this.expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            try {
                const ticketChunk = this.expo.sendPushNotificationsAsync(chunk);
                tickets.push(ticketChunk);
            } catch (error) {
                console.log(error);
            }
        }

        return {
            done: true,
        };
    }
}
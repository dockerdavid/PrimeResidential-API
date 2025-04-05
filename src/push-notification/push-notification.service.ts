import {
    Injectable,
} from '@nestjs/common';

import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { TwilioService } from 'nestjs-twilio';

import { UsersEntity } from '../entities/users.entity';
import envVars from '../config/env';

export interface TokensNotification {
    tokens: string[];
    users: UsersEntity[];
}

export interface PushNotification {
    body: string;
    title: string;
    data?: Record<string, any>;
    sound?: string;
    tokensNotification: TokensNotification;
}

@Injectable()
export class PushNotificationsService {

    constructor(
        private readonly twilioService: TwilioService,
    ) { }

    private expo = new Expo({
        accessToken: envVars.EXPO_ACCESS_TOKEN,
        useFcmV1: true,
    });

    sendNotification(pushNotification: PushNotification) {
        const areExpoTokens = pushNotification.tokensNotification.tokens.every(Expo.isExpoPushToken);

        if (!areExpoTokens) {
            return
        }

        const messages: ExpoPushMessage[] = pushNotification.tokensNotification.tokens.map((token) => ({
            to: token,
            sound: pushNotification.sound || 'default',
            body: pushNotification.body,
            title: pushNotification.title,
            data: pushNotification.data,
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

        pushNotification.tokensNotification.users.forEach((user) => {
            this.twilioService.client.messages.create({
                body: pushNotification.body,
                from: envVars.TWILIO_SENDER_NUMBER,
                to: user.phoneNumber,
            })
                .then((message: any) => console.log('SMS sent successfully:', message.sid))
                .catch((error: any) => console.error('Error sending SMS:', error));
        });

        return {
            done: true,
        };
    }
}
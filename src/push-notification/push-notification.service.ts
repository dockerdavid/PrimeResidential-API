import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import envVars from '../config/env';
import { UsersEntity } from '../entities/users.entity';
import { TwilioService } from 'nestjs-twilio';


export interface PushNotification {
    body: string;
    title: string;
    data?: Record<string, any>;
    sound?: string;
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

    sendNotification(users: UsersEntity[], notification: PushNotification) {
        console.log(users)
        const toTokens = users.map((user) => user.token);
        const areExpoTokens = toTokens.every(Expo.isExpoPushToken);

        console.log('Expo tokens:', toTokens);

        if (!areExpoTokens) {
            return
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

        users.forEach((user) => {
            console.log('Sending SMS to user:', user.phoneNumber);
            this.twilioService.client.messages.create({
                body: notification.body,
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
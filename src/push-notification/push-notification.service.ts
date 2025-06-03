import {
    Injectable,
    Logger,
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
    private readonly logger = new Logger(PushNotificationsService.name);

    constructor(
        private readonly twilioService: TwilioService,
    ) { }

    private expo = new Expo({
        accessToken: envVars.EXPO_ACCESS_TOKEN,
        useFcmV1: true,
    });

    private async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
        try {
            // Basic phone number validation
            if (!phoneNumber || !phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
                this.logger.warn(`Invalid phone number format: ${phoneNumber}`);
                return false;
            }

            const result = await this.twilioService.client.messages.create({
                body: message,
                from: envVars.TWILIO_SENDER_NUMBER,
                to: phoneNumber,
            });

            this.logger.log(`SMS sent successfully to ${phoneNumber}, SID: ${result.sid}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to send SMS to ${phoneNumber}: ${error.message}`, error.stack);
            return false;
        }
    }

    async sendNotification(pushNotification: PushNotification) {
        if (!envVars.ENABLE_NOTIFICATIONS) {
            return {
                done: true,
            };
        }

        // Handle Expo push notifications
        const areExpoTokens = pushNotification.tokensNotification.tokens.every(Expo.isExpoPushToken);
        if (areExpoTokens) {
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
                    const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
                    tickets.push(ticketChunk);
                } catch (error) {
                    this.logger.error('Error sending push notification:', error);
                }
            }
        }

        // Handle SMS notifications
        const smsResults = await Promise.all(
            pushNotification.tokensNotification.users.map(user => 
                this.sendSMS(user.phoneNumber, pushNotification.body)
            )
        );

        const failedSMS = smsResults.filter(result => !result).length;
        if (failedSMS > 0) {
            this.logger.warn(`${failedSMS} SMS messages failed to send`);
        }

        return {
            done: true,
            smsSent: smsResults.filter(result => result).length,
            smsFailed: failedSMS,
        };
    }
}
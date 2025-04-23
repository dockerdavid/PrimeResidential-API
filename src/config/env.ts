import * as joi from 'joi';

import 'dotenv/config';

interface EnvVars {
    DB_CONNECTION: string
    DB_HOST: string
    DB_PORT: number
    DB_DATABASE: string
    DB_USERNAME: string
    DB_PASSWORD: string
    TWILIO_SID: string
    TWILIO_TOKEN: string
    TWILIO_SENDER_NUMBER: string
    JWT_SECRET: string
    PORT: number
    EXPO_ACCESS_TOKEN: string
    ENABLE_NOTIFICATIONS: boolean
    ENABLE_SMS: boolean
}

const envSchema = joi
  .object({
    DB_CONNECTION: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_DATABASE: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    TWILIO_SID: joi.string().required(),
    TWILIO_TOKEN: joi.string().required(),
    TWILIO_SENDER_NUMBER: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    PORT: joi.number().default(3000),
    EXPO_ACCESS_TOKEN: joi.string().required(),
    ENABLE_NOTIFICATIONS: joi.boolean().default(false),
    ENABLE_SMS: joi.boolean().default(false),
  })
  .unknown(true)
  .required();

const { error, value } = envSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export default envVars;

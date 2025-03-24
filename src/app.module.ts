import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { MongooseModelModule } from './mongoose_models_module/mongoose-models.module';
import { DatabaseModule } from './infra/mongoose/database.module';
import { SharedModule } from './common/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_URI: Joi.string().required(),
        JWT_REFRESH_TOKEN_PRIVATE_KEY: Joi.string().required(),
        JWT_REFRESH_TOKEN_PUBLIC_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_PRIVATE_KEY: Joi.string().required(),
        JWT_ACCESS_TOKEN_PUBLIC_KEY: Joi.string().required(),
        SUPER_ADMIN_EMAIL: Joi.string().required(),
        APP_URL: Joi.string().required(),
        // RABBIT_MQ_URL: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
      }),
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule, MongooseModelModule, DatabaseModule, SharedModule, 
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    // Enable Mongoose debugging
    mongoose.set('debug', true);
  }
}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { User } from 'src/schema/user.schema';
import { UserOtp } from 'src/schema/user_otp.schema';
import { CommonService } from 'src/common/common.service';
import { SharedModule } from 'src/common/shared.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // ClientsModule.register([
    //   {
    //     name: 'RMQ_NOTIFICATION_FORGET_EMAIL',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBIT_MQ_URL],
    //       queue: CONFIG.RMQ_NOTIFICATION_FORGET_EMAIL,
    //       noAck: false,
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    //   {
    //     name: 'RMQ_NOTIFICATION_OTP_EMAIL',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBIT_MQ_URL],
    //       queue: CONFIG.RMQ_NOTIFICATION_OTP_EMAIL,
    //       noAck: false,
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    //   {
    //     name: 'RMQ_NOTIFICATION_OTP_SMS',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [process.env.RABBIT_MQ_URL],
    //       queue: CONFIG.RMQ_NOTIFICATION_OTP_SMS,
    //       noAck: false,
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),
    JwtModule.register({
      global: true,
    }),
    SharedModule
  ],
  controllers: [AuthController],
  providers: [AuthService, CommonService]
})
export class AuthModule {}

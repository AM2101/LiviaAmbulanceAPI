import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/common/shared.module';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from 'src/common/common.service';

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
      SharedModule,  ],
  controllers: [UserController],
  providers: [UserService, CommonService]
})
export class UserModule {}

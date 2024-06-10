// ! Do we need it?
import { Module } from '@nestjs/common';
import { ForgetPasswordController } from './forgetPassword.controller';
import { ForgetPasswordService } from './forgetPassword.service';

@Module({
  controllers: [ForgetPasswordController],
  providers: [ForgetPasswordService],
})
export class ForgetPasswordModule {}

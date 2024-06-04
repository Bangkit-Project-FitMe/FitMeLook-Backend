import { Module } from '@nestjs/common';
import { ForgetPasswordController } from './forgetpassword.controller';
import { ForgetPasswordService } from './forgetPassword.service';

@Module({
  controllers: [ForgetPasswordController],
  providers: [ForgetPasswordService],
})
export class ForgetPasswordModule {}

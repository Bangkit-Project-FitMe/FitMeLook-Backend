import { Body, Controller, Post } from '@nestjs/common';
import { ForgetPasswordService } from './forgetPassword.service';

@Controller('forget-password')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @Post()
  async postForgetPassword(
    @Body('email') userEmail: string,
    @Body('newPassword') userNewPassword: string,
  ) {
    return this.forgetPasswordService.postForgetPassword(
      userEmail,
      userNewPassword,
    );
  }
}

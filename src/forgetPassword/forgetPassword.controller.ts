import { Body, Controller, Post } from '@nestjs/common';
import { ForgetPasswordService } from './forgetPassword.service';

@Controller('forget')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @Post()
  postForgetPassword(
    @Body('email') userEmail: string,
    @Body('password') userpass: string,
  ) {
    return this.forgetPasswordService.postForgetPassword(userEmail, userpass);
  }
}

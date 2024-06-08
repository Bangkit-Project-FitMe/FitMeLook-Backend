import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async postRegister(
    @Body('email') userEmail: string,
    @Body('password') userPass: string,
  ) {
    return this.registerService.userRegister(userEmail, userPass);
  }
}

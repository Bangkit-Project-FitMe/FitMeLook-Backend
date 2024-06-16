import { Body, Controller, Post } from '@nestjs/common';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  async postRegister(
    @Body('user_id') userID: string,
    @Body('email') userEmail: string,
    @Body('full_name') userFullName: string,
  ) {
    return this.registerService.userRegister(userID, userEmail, userFullName);
  }
}

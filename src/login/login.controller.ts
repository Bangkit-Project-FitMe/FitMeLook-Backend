// ! Do we need it?
import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  postLogin(
    @Body('email') userEmail: string,
    @Body('password') userPass: string,
  ) {
    return this.loginService.userLogin(userEmail, userPass);
  }
}

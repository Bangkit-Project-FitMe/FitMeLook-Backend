import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
  userLogin(email: string, password: string) {
    return {
      message: 'login successfully',
      email: email,
      password: password,
    };
  }
}

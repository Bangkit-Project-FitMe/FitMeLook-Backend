import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterService {
  userRegister(email: string, password: string) {
    return {
      message: 'register successfully',
      email: email,
      password: password,
    };
  }
}

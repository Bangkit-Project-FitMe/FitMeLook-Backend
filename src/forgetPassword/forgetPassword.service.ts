import { Injectable } from '@nestjs/common';

@Injectable()
export class ForgetPasswordService {
  postForgetPassword(email: string, password: string) {
    return {
      email: email,
      password: password,
    };
  }
}

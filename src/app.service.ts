import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): { status: string; message: string } {
    return {
      status: 'success',
      message:
        'Welcome to the FitMeLook API. Please refer to the documentation for available endpoints.',
    };
  }
}

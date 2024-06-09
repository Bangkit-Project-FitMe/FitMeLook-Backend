import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the welcome message', async () => {
      const expectedResponse = {
        status: 'success',
        message:
          'Welcome to the FitMeLook API. Please refer to the documentation for available endpoints.',
      };
      expect(await appController.getHome()).toEqual(expectedResponse);
    });
  });
});

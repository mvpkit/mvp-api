import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

describe('Mock initial data', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const user = await userService.findOne({
      where: {
        email: 'user@test.com',
      },
    });
    if (!user) {
      const newUser = await userService.create({
        email: 'user@test.com',
        password: 'password',
      });
      expect(newUser).toHaveProperty('id');
    }
  });
});

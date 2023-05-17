import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { EditUserDto } from '../dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [UserController],
        providers: [
          UserService,
          ConfigService,
          PrismaService,
        ],
      }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('editUser', () => {
    it('should edit the user', async () => {
      const FAKE_USER_ID = 'FAKE_ID';
      const initialUser: EditUserDto = {
        email: 'fake-fake@mail.com',
        firstName: 'fake-fake-fistName',
        lastName: 'fake-fake-lastName',
      };
      const updatedUser: User = {
        id: FAKE_USER_ID,
        email: 'updated-fake@mail.com',
        firstName: 'updated-fake-fistName',
        lastName: 'updated-fake-lastName',
        hash: 'hash should be deleted in service',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const expected = { ...updatedUser };
      delete expected.hash;

      service.editUser = jest
        .fn()
        .mockResolvedValue(expected);

      const result = await controller.editUser(
        FAKE_USER_ID,
        initialUser,
      );
      expect(service.editUser).toBeCalledWith(
        FAKE_USER_ID,
        initialUser,
      );

      expect(result).toEqual(expected);
    });
  });
});

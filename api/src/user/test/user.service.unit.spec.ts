import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserDto } from '../dto';
import { User } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          UserService,
          PrismaService,
          ConfigService,
        ],
      }).compile();

    userService = module.get<UserService>(UserService);
    prismaService =
      module.get<PrismaService>(PrismaService);
  });

  describe('editUser', () => {
    it('should edit a user and return the updated user', async () => {
      const FAKE_USER_ID = 'FAKE_ID';
      const initialUser: UserDto = {
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

      jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(updatedUser);

      const result = await userService.editUser(
        FAKE_USER_ID,
        initialUser,
      );

      const expected = { ...updatedUser };
      delete expected.hash;
      expect(result).toEqual(expected);
      expect(
        prismaService.user.update,
      ).toHaveBeenCalledWith({
        where: { id: FAKE_USER_ID },
        data: initialUser,
      });
    });
  });
});

import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { UserDto } from 'src/user/dto';
import { unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';

describe('App', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get<PrismaService>(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'keri@gmail.com',
      password: 'password',
    };

    describe('Signup', () => {
      it('should register a new user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should not register a new user with an existing email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });

      it('should not register a new user with the email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });

      it('should not register a new user with the password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });

      it('should not register a new user with an invalid email', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ ...dto, email: 'invalid' })
          .expectStatus(400);
      });

      it('should not register a new user if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });
    });

    describe('Login', () => {
      it('should not login a user with an invalid email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, email: 'invalid' })
          .expectStatus(400);
      });

      it('should not login with the email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, email: '' })
          .expectStatus(400);
      });

      it('should not login with the password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, password: '' })
          .expectStatus(400);
      });

      it('should not login a user with an invalid password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ ...dto, password: 'invalid' })
          .expectStatus(403);
      });

      it('should login a user', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('Users', () => {
    const dto: UserDto = {
      email: 'keri123@gmail.com',
      firstName: 'Keri',
    };
    it('Update the user', () => {
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains(dto.email)
        .expectBodyContains(dto.firstName);
    });

    it('should not update the user with an invalid email', () => {
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody({ ...dto, email: 'invalid' })
        .expectStatus(400);
    });
  });

  describe('Transactions', () => {
    // get transactions

    // upload transactions file
    describe('Upload', () => {
      const TEMP_DIR = `${tmpdir()}/transactions.txt`;
      const defaultData = [
        '12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS',
        '12021-12-03T11:46:02-03:00DOMINANDO INVESTIMENTOS       0000050000MARIA CANDIDA',
        '22022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000012750THIAGO OLIVEIRA',
        '32022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500THIAGO OLIVEIRA',
        '42022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500JOSE CARLOS',
      ];
      const makeFile = (data: string[]) => {
        writeFileSync(TEMP_DIR, data.join('\n'));
      };

      afterEach(() => {
        unlinkSync(TEMP_DIR);
      });

      it('should upload a file', async () => {
        makeFile(defaultData);
        return pactum
          .spec()
          .post('/transaction/upload')
          .withFile('file', TEMP_DIR)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(201);
      });

      it('should not upload a file with invalid type', async () => {
        makeFile([
          '72022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500JOSE CARLOS',
        ]);
        return pactum
          .spec()
          .post('/transaction/upload')
          .withFile('file', TEMP_DIR)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(422);
      });

      it('should not upload a file with missing file', async () => {
        makeFile([]);
        return pactum
          .spec()
          .post('/transaction/upload')
          .withFile('file', TEMP_DIR)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });

      it('should not upload a file with invalid formatted file', async () => {
        makeFile(['invalid']);
        return pactum
          .spec()
          .post('/transaction/upload')
          .withFile('file', TEMP_DIR)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(422);
      });
    });
  });
});

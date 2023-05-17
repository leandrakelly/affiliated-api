import { Test, TestingModule } from '@nestjs/testing';
import {
  TransactionController,
  UploadedFileData,
} from '../transaction.controller';
import {
  TransactionService,
  TransactionResumeBySeller,
} from '../transaction.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TransactionType } from '@prisma/client';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [TransactionController],
        providers: [
          TransactionService,
          ConfigService,
          PrismaService,
        ],
      }).compile();

    controller = module.get<TransactionController>(
      TransactionController,
    );
    service = module.get<TransactionService>(
      TransactionService,
    );
  });

  describe('getTransactions', () => {
    it('should retrive transactions with sum by seller', async () => {
      const expected: TransactionResumeBySeller[] = [
        {
          name: 'seller 1',
          earnings: 5,
          transactions: [
            {
              id: 'fake-id',
              type: TransactionType.AFFILIATE_SALE,
              date: new Date(),
              value: 5,
              createdAt: new Date(),
              updatedAt: null,
              deletedAt: null,
              productId: 'fake-id',
              sellerId: 'fake-id',
              product: {
                id: 'fake-id',
                name: 'fake-name',
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
              },
              seller: {
                id: 'fake-id',
                name: 'fake-name',
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
              },
            },
          ],
        },
      ];

      jest
        .spyOn(service, 'getTransactions')
        .mockResolvedValue(expected);

      await expect(
        controller.getTransactions(),
      ).resolves.toEqual(expected);

      expect(service.getTransactions).toBeCalledWith();
    });
  });

  describe('uploadTransactionFile', () => {
    it('should upload file with transactions', async () => {
      const FILE_BODY =
        '42022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500JOSE CARLOS';
      const fileData: UploadedFileData = {
        fieldname: 'file',
        originalname: 'example.txt',
        encoding: 'utf-8',
        mimetype: 'text/plain',
        size: 1024,
        buffer: Buffer.from(FILE_BODY),
      };

      jest
        .spyOn(service, 'processTransactionFile')
        .mockResolvedValue();

      expect(
        await controller.uploadTransactionFile(fileData),
      ).resolves;

      expect(
        service.processTransactionFile,
      ).toHaveBeenCalledWith(FILE_BODY);
    });
  });
});

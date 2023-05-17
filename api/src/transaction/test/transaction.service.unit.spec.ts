import { Test, TestingModule } from '@nestjs/testing';
import {
  TransactionResumeBySeller,
  TransactionService,
  TransactionWithRelations,
} from '../transaction.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import {
  Product,
  Seller,
  TransactionType,
} from '@prisma/client';

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          TransactionService,
          PrismaService,
          ConfigService,
        ],
      }).compile();

    service = module.get<TransactionService>(
      TransactionService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getTransactions', () => {
    it('should retrive transactions with sum by seller', async () => {
      const transaction = {
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
          name: 'fake-product-name',
          createdAt: new Date(),
          updatedAt: null,
          deletedAt: null,
        },
        seller: {
          id: 'fake-id',
          name: 'fake-seller-name',
          createdAt: new Date(),
          updatedAt: null,
          deletedAt: null,
        },
      };
      const transactions: TransactionWithRelations[] =
        new Array(5).fill({
          ...transaction,
          value: 10,
        });
      const expected: TransactionResumeBySeller[] = [
        {
          name: 'fake-seller-name',
          earnings: 50,
          transactions,
        },
      ];

      jest
        .spyOn(prisma.transaction, 'findMany')
        .mockResolvedValue(transactions);

      await expect(
        service.getTransactions(),
      ).resolves.toEqual(expected);

      expect(prisma.transaction.findMany).toBeCalledWith({
        include: {
          product: true,
          seller: true,
        },
      });
    });
    it.each([
      TransactionType.PAID_COMMISSION,
      TransactionType.AFFILIATE_SALE,
      TransactionType.PRODUCER_SALE,
      TransactionType.RECEIVED_COMMISSION,
    ])(
      'should retrive transactions by seller with sum correct',
      async (type) => {
        const transaction = {
          id: 'fake-id',
          type: type,
          date: new Date(),
          value: 5,
          createdAt: new Date(),
          updatedAt: null,
          deletedAt: null,
          productId: 'fake-id',
          sellerId: 'fake-id',
          product: {
            id: 'fake-id',
            name: 'fake-product-name',
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
          },
          seller: {
            id: 'fake-id',
            name: 'fake-seller-name',
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
          },
        };
        const transactions: TransactionWithRelations[] =
          new Array(5).fill({
            ...transaction,
            value: 10,
          });
        const expected: TransactionResumeBySeller[] = [
          {
            name: 'fake-seller-name',
            earnings:
              type === TransactionType.PAID_COMMISSION
                ? -50
                : 50,
            transactions,
          },
        ];

        jest
          .spyOn(prisma.transaction, 'findMany')
          .mockResolvedValue(transactions);

        await expect(
          service.getTransactions(),
        ).resolves.toEqual(expected);

        expect(prisma.transaction.findMany).toBeCalledWith({
          include: {
            product: true,
            seller: true,
          },
        });
      },
    );
  });

  describe('processTransactionFile', () => {
    it('shold save transactions', async () => {
      const FILE_BODY =
        '42022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500JOSE CARLOS';
      const product: Product = {
        id: 'fake-id',
        name: 'CURSO DE BEM-ESTAR',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const seller: Seller = {
        id: 'fake-id',
        name: 'JOSE CARLOS',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      };
      const transactions = [
        {
          type: TransactionType.RECEIVED_COMMISSION,
          date: new Date('2022-01-16T14:13:54-03:00'),
          value: 4500,
          productId: 'fake-id',
          sellerId: 'fake-id',
        },
      ];

      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (cb) => {
          Object.assign(prisma, {
            transaction: {
              createMany: jest.fn(),
            },
            product: {
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue(product),
            },
            seller: {
              findUnique: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue(seller),
            },
          });
          return await cb(prisma);
        });

      expect(
        await service.processTransactionFile(FILE_BODY),
      ).resolves;

      expect(prisma.transaction.createMany).toBeCalledWith({
        data: transactions,
      });
      expect(prisma.seller.findUnique).toBeCalledWith({
        where: { name: 'JOSE CARLOS' },
      });
      expect(prisma.product.findUnique).toBeCalledWith({
        where: { name: 'CURSO DE BEM-ESTAR' },
      });
      expect(prisma.seller.create).toBeCalledWith({
        data: { name: seller.name },
      });
      expect(prisma.product.create).toBeCalledWith({
        data: { name: product.name },
      });
    });
  });
});

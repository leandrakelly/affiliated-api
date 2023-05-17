import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Product,
  Seller,
  Transaction,
  TransactionType,
} from '@prisma/client';
import {
  TransactionDto,
  TransactionResumeBySellerDto,
} from './dto';

type PrismaSubset = Omit<
  PrismaService,
  | '$connect'
  | '$disconnect'
  | '$on'
  | '$transaction'
  | '$use'
>;

export type TransactionWithRelations = Transaction & {
  product: Product;
  seller: Seller;
};

// export type TransactionResumeBySeller = {
//   name: string;
//   earnings: number;
//   transactions: TransactionWithRelations[];
// };

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async getTransactions(): Promise<
    TransactionResumeBySellerDto[]
  > {
    const transactions =
      await this.prisma.transaction.findMany({
        include: {
          product: true,
          seller: true,
        },
      });

    return this.groupTransactionsBySeller(transactions);
  }

  private groupTransactionsBySeller(
    transactions: TransactionWithRelations[],
  ): TransactionResumeBySellerDto[] {
    const transactionGroupBySeller = new Map<
      string,
      TransactionResumeBySellerDto
    >();

    for (const transaction of transactions) {
      const group = transactionGroupBySeller.get(
        transaction.seller.name,
      );

      if (group) group.transactions.push(transaction);

      const sellerData = {
        name: transaction.seller.name,
        earnings: this.calculateEarnings(
          group?.earnings,
          transaction.value,
          transaction.type,
        ),
        transactions: group?.transactions || [transaction],
      };

      transactionGroupBySeller.set(
        sellerData.name,
        sellerData,
      );
    }

    return Array.from(transactionGroupBySeller.values());
  }

  private calculateEarnings(
    groupEarnings = 0,
    transactionEarnings: number,
    type: TransactionType,
  ): number {
    const currentEarnings =
      type === TransactionType.PAID_COMMISSION
        ? -transactionEarnings
        : transactionEarnings;
    return groupEarnings + currentEarnings;
  }

  async processTransactionFile(
    fileData: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      const transactions =
        await this.generateTransactionLine(
          fileData,
          prisma,
        );
      await prisma.transaction.createMany({
        data: transactions,
      });
    });
  }

  private async generateTransactionLine(
    fileData: string,
    prisma: PrismaSubset,
  ): Promise<
    (TransactionDto & {
      productId: string;
      sellerId: string;
    })[]
  > {
    if (!fileData)
      throw new HttpException(
        'Invalid file',
        HttpStatus.BAD_REQUEST,
      );
    const lines = fileData.split('\n');
    const transactions = [];

    for (const line of lines) {
      if (!line) continue;

      const transaction = this.parseTransaction(line);
      if (!transaction) continue;
      const { type, date, value, seller, product } =
        transaction;

      const productId = await this.findOrCreate<{
        name: string;
      }>(prisma, 'product', product, { name: product });
      const sellerId = await this.findOrCreate<{
        name: string;
      }>(prisma, 'seller', seller, { name: seller });

      transactions.push({
        type,
        date,
        value,
        productId,
        sellerId,
      });
    }

    return transactions;
  }

  private parseTransaction(line: string): TransactionDto {
    const transactionRegex =
      /(.{1})(.{25})(.{30})(.{10})(.*)/;
    const match = line.match(transactionRegex);
    if (!match)
      throw new HttpException(
        `Invalid transaction format: ${line}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const [
      ,
      type,
      dateString,
      product,
      valueString,
      seller,
    ] = match;

    return {
      type: this.getTransactionType(Number(type)),
      date: new Date(dateString),
      product: product.trim(),
      value: Number(valueString),
      seller: seller.trim(),
    };
  }

  private async findOrCreate<T>(
    prisma: PrismaSubset,
    entity: string,
    key: NonNullable<unknown>,
    data: T,
  ): Promise<string> {
    const findEntity = await prisma[entity].findUnique({
      where: { name: key },
    });
    if (findEntity) return findEntity.id;

    const createdEntity = await prisma[entity].create({
      data,
    });
    return createdEntity.id;
  }

  private getTransactionType(
    type: number,
  ): TransactionType {
    const mappedNumbers = Object.freeze({
      1: TransactionType.PRODUCER_SALE,
      2: TransactionType.AFFILIATE_SALE,
      3: TransactionType.PAID_COMMISSION,
      4: TransactionType.RECEIVED_COMMISSION,
    });
    const transaction = mappedNumbers[type];
    if (transaction) return transaction;
    throw new HttpException(
      `Invalid transaction type: ${type}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

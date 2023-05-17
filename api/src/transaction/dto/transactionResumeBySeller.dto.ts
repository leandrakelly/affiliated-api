import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TransactionWithRelations } from '../transaction.service';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';

export class TransactionResumeBySellerDto {
  @ApiProperty({
    description: 'Name of seller',
    example: 'Joe Smith',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Sum of earings in transactions',
    example: 50,
  })
  @IsNumber()
  earnings: number;

  @ApiProperty({
    description: 'All transactions of seller',
    example: [
      {
        id: 'id',
        type: TransactionType.AFFILIATE_SALE,
        date: new Date().toISOString(),
        value: 50,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        deletedAt: null,
        product: {
          id: 'id',
          name: 'COURSE',
          createdAt: new Date().toISOString(),
          updatedAt: null,
          deletedAt: null,
        },
        seller: {
          id: 'id',
          name: 'Joe Smith',
          createdAt: new Date().toISOString(),
          updatedAt: null,
          deletedAt: null,
        },
      },
    ],
  })
  @IsArray()
  transactions: TransactionWithRelations[];
}

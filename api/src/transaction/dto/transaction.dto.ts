import { TransactionType } from '@prisma/client';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class TransactionDto {
  @IsString()
  @IsNotEmpty()
  type: TransactionType;

  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsString()
  @IsNotEmpty()
  product: string;

  @IsString()
  @IsNotEmpty()
  seller: string;
}

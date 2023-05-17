import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import {
  TransactionResumeBySeller,
  TransactionService,
} from './transaction.service';
import { FileInterceptor } from '@nestjs/platform-express';

export interface UploadedFileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@UseGuards(JwtGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
  ) {}

  @Get()
  async getTransactions(): Promise<
    TransactionResumeBySeller[]
  > {
    return this.transactionService.getTransactions();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTransactionFile(
    @UploadedFile() file: UploadedFileData,
  ): Promise<void> {
    const fileData = file.buffer.toString('utf-8');
    await this.transactionService.processTransactionFile(
      fileData,
    );
  }
}

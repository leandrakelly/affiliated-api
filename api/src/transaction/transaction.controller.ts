import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { TransactionService } from './transaction.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { TransactionResumeBySellerDto } from './dto';

export interface UploadedFileData {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiTags('transaction')
@UseGuards(JwtGuard)
@Controller('transaction')
export class TransactionController {
  constructor(
    private transactionService: TransactionService,
  ) {}

  @ApiOperation({ summary: 'Get transactions by Seller' })
  @ApiOkResponse({
    isArray: true,
    type: TransactionResumeBySellerDto,
    description: 'List of transactions group by seller',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getTransactions(): Promise<
    TransactionResumeBySellerDto[]
  > {
    return this.transactionService.getTransactions();
  }

  @ApiOperation({
    summary: 'Save transactions from file',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'No contet when file is processed',
  })
  @HttpCode(HttpStatus.CREATED)
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

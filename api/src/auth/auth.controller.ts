import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, TokenDto } from './dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    type: TokenDto,
    description: 'JSON Web Token to login in system',
  })
  @ApiBody({
    type: AuthDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Login with registred user' })
  @ApiOkResponse({
    type: TokenDto,
    description: 'JSON Web Token to login in system',
  })
  @ApiBody({
    type: AuthDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto): Promise<TokenDto> {
    return this.authService.signin(dto);
  }
}

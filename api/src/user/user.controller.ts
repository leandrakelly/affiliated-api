import {
  Body,
  Controller,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserDto } from './dto';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('user')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Edit user' })
  @ApiOkResponse({
    type: UserDto,
    description: 'Edited user body',
  })
  @Patch()
  async editUser(
    @GetUser('id') userId: string,
    @Body() dto: UserDto,
  ): Promise<UserDto> {
    return this.userService.editUser(userId, dto);
  }
}

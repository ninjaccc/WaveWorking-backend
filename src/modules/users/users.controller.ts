import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.schema';
import ParseObjectIdPipe from '../../pipes/parse-object-id.pipe';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { Role, Roles } from 'src/modules/auth/role.constant';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* Create User */
  /*--------------------------------------------*/
  @Post()
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /* Get All Users */
  /*--------------------------------------------*/
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Manager, Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
    isArray: true,
  })
  findAll() {
    return this.usersService.findAll();
  }

  /* Get Single Users */
  /*--------------------------------------------*/
  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findById(id);
  }

  /* Update User Info */
  /*--------------------------------------------*/
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /* Delete Single User */
  /*--------------------------------------------*/
  @Delete(':id')
  @ApiBearerAuth()
  removeOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }

  /* Delete All User(only for testing) */
  /*--------------------------------------------*/
  @Delete()
  @ApiBearerAuth()
  remove() {
    return this.usersService.remove();
  }
}

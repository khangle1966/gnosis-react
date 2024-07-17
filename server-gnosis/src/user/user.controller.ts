import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  HttpException,
  Put,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ProfileService } from 'src/profile/profile.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('v1/user')
export class UserController {
  constructor(
    private userService: UserService,
    private profileService: ProfileService,
  ) { }

  // Tạo người dùng mới
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // Lấy tất cả người dùng
  @Get()
  async findAllUser() {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Tìm người dùng theo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Cấm người dùng
  @Put('ban/:uid')
  async banUser(@Param('uid') uid: string): Promise<User> {
    return this.userService.banUser(uid);
  }

  // Hủy cấm người dùng
  @Put('unban/:uid')
  async unbanUser(@Param('uid') uid: string): Promise<User> {
    return this.userService.unbanUser(uid);
  }

  // Cập nhật thông tin người dùng
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Xóa người dùng
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const userProfile = await this.profileService.findOne(user.profile);
      if (!userProfile) {
        await this.userService.remove(id);
      } else {
        await this.profileService.remove(userProfile.id);
        await this.userService.remove(id);
      }
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả người dùng (có trùng lặp với findAllUser)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // Lấy dữ liệu người dùng theo tháng
  @Get('monthly/monthly-data')
  async getMonthlyData() {
    try {
      return this.userService.getMonthlyData();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Xóa người dùng theo UID
  @Delete('uid/:uid')
  async deleteUserByUid(@Param('uid') uid: string): Promise<void> {
    await this.userService.deleteByUid(uid);
  }
}

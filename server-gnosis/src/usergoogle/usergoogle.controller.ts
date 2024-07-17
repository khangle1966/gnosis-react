import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  HttpException,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { UsergoogleService } from './usergoogle.service';
import { CreateUsergoogleDto } from './dto/create-usergoogle.dto';
import { UpdateUsergoogleDto } from './dto/update-usergoogle.dto';
import { AuthService } from 'src/auth/auth.service';
import { Usergoogle } from './entities/usergoogle.entity';
import { ProfileService } from 'src/profile/profile.service';

@Controller('v1/usergoogle')
export class UsergoogleController {
  constructor(
    private usergoogleService: UsergoogleService,
    private authService: AuthService,
    private profileService: ProfileService,
  ) { }

  // Tạo người dùng mới
  @Post()
  async create(@Body() createUserDto: CreateUsergoogleDto) {
    return this.usergoogleService.create(createUserDto);
  }

  // Lấy tất cả người dùng
  @Get()
  async findAllUser() {
    try {
      const users = await this.usergoogleService.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  }

  // Lấy dữ liệu người dùng theo tháng
  @Get('monthly/monthly-data')
  async getMonthlyDataUser() {
    try {
      return this.usergoogleService.getMonthlyDataUser();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Tìm người dùng theo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usergoogle> {
    try {
      const user = await this.usergoogleService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật cấp độ giảng viên
  @Get('update-instructor-level/:uid')
  async updateInstructorLevel(@Param('uid') uid: string) {
    await this.usergoogleService.updateInstructorLevel(uid);
    return this.usergoogleService.findByUid(uid);
  }

  // Cập nhật thông tin người dùng
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUsergoogleDto,
  ): Promise<Usergoogle> {
    try {
      const user = await this.usergoogleService.update(id, updateUserDto);
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
      const user = await this.usergoogleService.findOne(id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      const userProfile = await this.profileService.findOne(user.profile);
      if (!userProfile) {
        await this.usergoogleService.remove(id);
      } else {
        await this.profileService.remove(userProfile.id);
        await this.usergoogleService.remove(id);
      }
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả giảng viên
  @Get('getintstructor/instructors')
  async getAllInstructors() {
    return this.usergoogleService.findAllInstructors();
  }

  // Lấy dữ liệu khóa học theo tháng của người dùng
  @Get('monthly-data/:uid')
  async getMonthlyData(@Param('uid') uid: string) {
    return this.usergoogleService.getMonthlyData(uid);
  }

  // Lấy cấp độ giảng viên của người dùng
  @Get('instructor-level/:uid')
  async getInstructorLevel(@Param('uid') uid: string) {
    return this.usergoogleService.getInstructorLevel(uid);
  }

  // Cập nhật URL ảnh của người dùng
  @Put('update-picurl/:id')
  async updatePicUrl(
    @Param('id') id: string,
    @Body('picUrl') picUrl: string
  ) {
    if (!picUrl) {
      throw new HttpException('picUrl is required', HttpStatus.BAD_REQUEST);
    }
    return this.usergoogleService.updatePicUrl(id, picUrl);
  }

  // Cấm người dùng
  @Put('ban/:id')
  async banUser(@Param('id') id: string) {
    return this.usergoogleService.banUser(id);
  }

  // Hủy cấm người dùng
  @Put('unban/:id')
  async unbanUser(@Param('id') id: string) {
    return this.usergoogleService.unbanUser(id);
  }
}

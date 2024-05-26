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

  @Post()
  async create(@Body() createUserDto: CreateUsergoogleDto) {
    return this.usergoogleService.create(createUserDto);
  }

  @Get()
  async findAllUser() {
    try {
      const users = await this.usergoogleService.findAll();
      return users;
    } catch (error) {
      throw error;
    }
  }
  @Get('monthly/monthly-data')
  async getMonthlyDataUser() {
    try {
      return this.usergoogleService.getMonthlyDataUser();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
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
  @Get('update-instructor-level/:uid')
  async updateInstructorLevel(@Param('uid') uid: string) {
    await this.usergoogleService.updateInstructorLevel(uid);
    return this.usergoogleService.findByUid(uid);
  }
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
  @Get('getintstructor/instructors')
  async getAllInstructors() {
    return this.usergoogleService.findAllInstructors();
  }

  @Get('calculate-salary/:uid')
  async calculateSalary(@Param('uid') uid: string) {
    const salary = await this.usergoogleService.calculateSalary(uid);
    return { uid, salary };
  }
  @Get('monthly-data/:uid')
  async getMonthlyData(@Param('uid') uid: string) {
    return this.usergoogleService.getMonthlyData(uid);
  }
}

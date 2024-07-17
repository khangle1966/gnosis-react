import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { UserService } from 'src/user/user.service';
import { UsergoogleService } from 'src/usergoogle/usergoogle.service';

@Controller('v1/profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private userService: UserService,
    private userGoogleService: UsergoogleService,
  ) {}

  // Kiểm tra email đã tồn tại hay chưa
  @Get(':email')  
  async checkEmailExists(@Param('email') email: string): Promise<{ exists: boolean }> {
    const exists = await this.profileService.findByEmail(email);
    return { exists };
  }

  // Lấy thông tin thống kê của hồ sơ theo ID
  @Get('stats/:id')
  async getProfileStats(@Param('id') id: string) {
    try {
      const stats = await this.profileService.getProfileStats(id);
      return stats;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Tạo hồ sơ cho người dùng Google
  @Post('googleprofile')
  async createProfileForUserGoogle(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    const requiredFields = ['id', 'email', 'userName'];
    const missingFields = requiredFields.filter(field => !createProfileDto[field]);
    if (missingFields.length > 0) {
      throw new HttpException(`Missing required fields: ${missingFields.join(', ')}`, HttpStatus.BAD_REQUEST);
    }
    try {
      const isExist = await this.profileService.findOne(createProfileDto.id);
      if (isExist) {
        throw new HttpException('Profile already exists', HttpStatus.BAD_REQUEST);
      }
      const newProfile = await this.profileService.create(createProfileDto);
      if (!newProfile) {
        await this.userGoogleService.remove(createProfileDto.id);
      } else {
        this.userGoogleService.update(newProfile.id, { profile: newProfile.id });
      }
      return newProfile;
    } catch (error) {
      throw error;
    }
  }

  // Tạo hồ sơ mới
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto): Promise<Profile> {
    const requiredFields = ['id', 'email', 'userName'];
    const missingFields = requiredFields.filter(field => !createProfileDto[field]);
    if (missingFields.length > 0) {
      throw new HttpException(`Missing required fields: ${missingFields.join(', ')}`, HttpStatus.BAD_REQUEST);
    }
    try {
      const isExist = await this.profileService.findOne(createProfileDto.id);
      if (isExist) {
        throw new HttpException('Profile already exists', HttpStatus.BAD_REQUEST);
      }
      const newProfile = await this.profileService.create(createProfileDto);
      if (!newProfile) {
        await this.userService.remove(createProfileDto.id);
      } else {
        this.userService.update(newProfile.id, { profile: newProfile.id });
      }
      return newProfile;
    } catch (error) {
      throw error;
    }
  }

  // Tìm hồ sơ theo ID
  @Get('by-id/:id')
  async findOne(@Param('id') id: string) {
    try {
      const profile = await this.profileService.findOne(id);
      if (!profile) {
        throw new NotFoundException(`Profile not found with ID: ${id}`);
      }
      return profile;
    } catch (error) {
      throw new NotFoundException('Profile not found');
    }
  }

  // Lấy tất cả hồ sơ
  @Get()
  async findAll() {
    try {
      const profiles = await this.profileService.findAll();
      return profiles;
    } catch (error) {
      throw error;
    }
  }

  // Cập nhật hồ sơ theo ID
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto): Promise<Profile> {
    try {
      const updatedProfile = await this.profileService.update(id, updateProfileDto);
      if (!updatedProfile) {
        throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
      }
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  // Xóa hồ sơ theo ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deletedProfile = await this.profileService.remove(id);
      if (!deletedProfile) {
        throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
      }
      return deletedProfile;
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả khóa học của hồ sơ theo ID
  @Get(':id/courses')
  async getAllCourseOfProfile(@Param('id') id: string) {
    try {
      const profile = await this.profileService.getAllCourseOfProfile(id);
      if (!profile) {
        throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
      }
      return profile;
    } catch (error) {
      throw error;
    }
  }
}

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
  async create(@Headers() headers: any): Promise<Usergoogle> {
    try {
      const authHeader = headers.authorization;
      const token = authHeader.replace('Bearer ', '');
      const decodedToken = await this.authService.verifyGoogleToken(token);
      const uid = decodedToken.uid;
      const existedUser = await this.usergoogleService.findOne(uid);
      if (existedUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }
      const user: Usergoogle = {
        uid,
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        profile: null,
      };
      const createdUser = await this.usergoogleService.create(user);
      return createdUser;
    } catch (error) {
      throw error;
    }
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

  @Get()
  findAll() {
    return this.usergoogleService.findAll();
  }
}
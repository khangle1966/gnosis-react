import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ProfileteacherService } from './profileteacher.service';
import { CreateProfileteacherDto } from './dto/create-profileteacher.dto';
import { UpdateProfileteacherDto } from './dto/update-profileteacher.dto';

@Controller('profileteacher')
export class ProfileteacherController {
  constructor(private readonly profileteacherService: ProfileteacherService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createProfileteacherDto: CreateProfileteacherDto) {
    return await this.profileteacherService.create(createProfileteacherDto);
  }

  @Get()
  async findAll() {
    return await this.profileteacherService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.profileteacherService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateProfileteacherDto: UpdateProfileteacherDto) {
    return await this.profileteacherService.update(id, updateProfileteacherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.profileteacherService.remove(id);
    return null;
  }
}

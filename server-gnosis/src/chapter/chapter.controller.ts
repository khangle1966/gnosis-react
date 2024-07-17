import { Body, Controller, Get, Post, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('v1/chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) { }

  // Tạo chương mới
  @Post()
  async create(@Body() createChapterDto: CreateChapterDto) {
    try {
      const chapter = await this.chapterService.create(createChapterDto);
      return chapter;
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy tất cả chương theo courseId
  @Get('course/:courseId')
  async getChaptersByCourseId(@Param('courseId') courseId: string) {
    try {
      return await this.chapterService.findByCourseId(courseId);
    } catch (error) {
      throw new HttpException('Chapters not found', HttpStatus.NOT_FOUND);
    }
  }

  // Lấy tất cả chương
  @Get()
  async findAll() {
    try {
      return await this.chapterService.findAll();
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy thông tin chương theo ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.chapterService.findOne(id);
    } catch (error) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
  }

  // Cập nhật chương theo ID
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    try {
      return await this.chapterService.update(id, updateChapterDto);
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Cập nhật thứ tự các chương
  @Put('chap/order')
  async updateChapterOrder(@Body() updateOrderDto: { chapters: { id: string; chapterNumber: number }[] }) {
    if (!updateOrderDto || !updateOrderDto.chapters || updateOrderDto.chapters.length === 0) {
      throw new HttpException('Invalid input data', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.chapterService.updateChapterOrder(updateOrderDto.chapters);
      return { statusCode: HttpStatus.OK, message: 'Chapters order updated successfully', data: result };
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Xóa chương theo ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.chapterService.remove(id);
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

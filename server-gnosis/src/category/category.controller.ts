import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity'; // Giả sử bạn có entity tương tự

@Controller('v1/category') // Cập nhật đường dẫn để phản ánh phiên bản API
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  // Tạo một danh mục mới
  @Post('post/')
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    const requiredFields = ['name']; // Giả sử 'name' là trường bắt buộc
    const missingFields = requiredFields.filter(field => !createCategoryDto[field]);
    if (missingFields.length > 0) {
      throw new HttpException(
        `Missing required fields: ${missingFields.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const category = await this.categoryService.create(createCategoryDto);
      return category;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR); // Sử dụng INTERNAL_SERVER_ERROR cho mọi lỗi
    }
  }

  // Lấy tất cả danh mục
  @Get('get/')
  async findAll(): Promise<Category[]> {
    try {
      const categories = await this.categoryService.findAll();
      return categories;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Lấy danh mục theo ID
  @Get('get/:id')
  async findOne(@Param('id') id: string): Promise<Category> {
    try {
      const category = await this.categoryService.findOne(id); // Giả định ID là số
      return category;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Cập nhật danh mục theo ID
  @Patch('patch/:id') // Sử dụng Patch thay vì Put
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoryService.update(id, updateCategoryDto);
      return category;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Xóa danh mục theo ID
  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.categoryService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

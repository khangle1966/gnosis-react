import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) { }

    // Tạo mục yêu thích mới
    @Post()
    create(@Body() createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
        return this.favoritesService.create(createFavoriteDto);
    }

    // Lấy tất cả mục yêu thích
    @Get()
    findAll(): Promise<Favorite[]> {
        return this.favoritesService.findAll();
    }

    // Lấy mục yêu thích theo userId
    @Get(':userId')
    findByUserId(@Param('userId') userId: string): Promise<Favorite> {
        return this.favoritesService.findByUserId(userId);
    }

    // Thêm khóa học vào mục yêu thích của người dùng
    @Patch(':userId/add/:courseId')
    addCourseToFavorites(@Param('userId') userId: string, @Param('courseId') courseId: string): Promise<Favorite> {
        return this.favoritesService.addCourseToFavorites(userId, courseId);
    }

    // Xóa khóa học khỏi mục yêu thích của người dùng
    @Patch(':userId/remove/:courseId')
    removeCourseFromFavorites(@Param('userId') userId: string, @Param('courseId') courseId: string): Promise<Favorite> {
        return this.favoritesService.removeCourseFromFavorites(userId, courseId);
    }

    // Xóa mục yêu thích theo ID
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.favoritesService.remove(id);
    }
}

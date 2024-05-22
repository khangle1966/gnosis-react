import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Post()
    create(@Body() createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
        return this.favoritesService.create(createFavoriteDto);
    }

    @Get()
    findAll(): Promise<Favorite[]> {
        return this.favoritesService.findAll();
    }

    @Get(':userId')
    findByUserId(@Param('userId') userId: string): Promise<Favorite> {
        return this.favoritesService.findByUserId(userId);
    }

    @Patch(':userId/add/:courseId')
    addCourseToFavorites(@Param('userId') userId: string, @Param('courseId') courseId: string): Promise<Favorite> {
        return this.favoritesService.addCourseToFavorites(userId, courseId);
    }

    @Patch(':userId/remove/:courseId')
    removeCourseFromFavorites(@Param('userId') userId: string, @Param('courseId') courseId: string): Promise<Favorite> {
        return this.favoritesService.removeCourseFromFavorites(userId, courseId);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.favoritesService.remove(id);
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) { }

  // Tạo mục yêu thích mới
  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    const favorite = new this.favoriteModel(createFavoriteDto);
    return favorite.save();
  }

  // Lấy tất cả mục yêu thích
  async findAll(): Promise<Favorite[]> {
    return this.favoriteModel.find().exec();
  }

  // Lấy mục yêu thích theo userId
  async findByUserId(userId: string): Promise<Favorite> {
    return this.favoriteModel.findOne({ userId }).exec();
  }

  // Thêm khóa học vào mục yêu thích của người dùng
  async addCourseToFavorites(userId: string, courseId: string): Promise<Favorite> {
    return this.favoriteModel.findOneAndUpdate(
      { userId },
      { $addToSet: { favorites: courseId } },
      { new: true, upsert: true }
    ).exec();
  }

  // Xóa khóa học khỏi mục yêu thích của người dùng
  async removeCourseFromFavorites(userId: string, courseId: string): Promise<Favorite> {
    return this.favoriteModel.findOneAndUpdate(
      { userId },
      { $pull: { favorites: courseId } },
      { new: true }
    ).exec();
  }

  // Xóa mục yêu thích theo ID
  async remove(id: string): Promise<void> {
    const result = await this.favoriteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Favorite with ID "${id}" not found`);
    }
  }
}

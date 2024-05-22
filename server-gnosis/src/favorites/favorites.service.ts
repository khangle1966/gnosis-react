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

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    const favorite = new this.favoriteModel(createFavoriteDto);
    return favorite.save();
  }

  async findAll(): Promise<Favorite[]> {
    return this.favoriteModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Favorite> {
    return this.favoriteModel.findOne({ userId }).exec();
  }

  async addCourseToFavorites(userId: string, courseId: string): Promise<Favorite> {
    return this.favoriteModel.findOneAndUpdate(
      { userId },
      { $addToSet: { favorites: courseId } },
      { new: true, upsert: true }
    ).exec();
  }

  async removeCourseFromFavorites(userId: string, courseId: string): Promise<Favorite> {
    return this.favoriteModel.findOneAndUpdate(
      { userId },
      { $pull: { favorites: courseId } },
      { new: true }
    ).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.favoriteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Favorite with ID "${id}" not found`);
    }
  }
}

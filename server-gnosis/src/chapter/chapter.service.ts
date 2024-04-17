// src/chapter/chapter.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Chapter } from "./entities/chapter.entity";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { Lesson } from "../lesson/entities/lesson.entity"; // Đảm bảo đường dẫn này chính xác
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Injectable()
export class ChapterService {

  constructor(
    @InjectModel(Chapter.name) private readonly chapterModel: Model<Chapter>,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson> // Thêm dòng này để inject Lesson model
  ) { }

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const newChapter = new this.chapterModel(createChapterDto);
    return await newChapter.save();
  }

  // Hàm này sẽ lấy tất cả lessons có chapterId tương ứng
  async findLessonsByChapterId(chapterId: Types.ObjectId): Promise<Lesson[]> {
    return await this.lessonModel.find({ chapter: chapterId }).exec(); // Sửa lại 'chapterId' thành 'chapter' nếu đây là tên trường trong Lesson entity
  }
  async findAll(): Promise<Chapter[]> {
    return await this.chapterModel.find().exec();
  }
  async findByCourseId(courseId: string): Promise<Chapter[]> {
    return await this.chapterModel.find({ courseId: courseId }).exec();
  }

  // Find a single chapter by ID
  async findOne(id: string): Promise<Chapter> {
    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return chapter;
  }

  // Update a chapter by ID
  async update(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const updatedChapter = await this.chapterModel.findByIdAndUpdate(id, updateChapterDto, { new: true }).exec();
    if (!updatedChapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return updatedChapter;
  }

  // Delete a chapter by ID
  async remove(id: string): Promise<Chapter> {
    const deletedChapter = await this.chapterModel.findByIdAndRemove(id).exec();
    if (!deletedChapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return deletedChapter;
  }

  // ...Thêm các hàm khác nếu cần
}

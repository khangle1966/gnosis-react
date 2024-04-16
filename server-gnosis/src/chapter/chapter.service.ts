// src/chapter/chapter.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Chapter } from "./entities/chapter.entity";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { Lesson } from "../lesson/entities/lesson.entity"; // Đảm bảo đường dẫn này chính xác
import { UpdateChapterDto } from "./dto/update-chapter.dto";

@Injectable()
export class ChapterService {
  findAll() {
    throw new Error('Method not implemented.');
  }
  remove(id: string) {
    throw new Error('Method not implemented.');
  }
  update(id: string, updateChapterDto: UpdateChapterDto) {
    throw new Error('Method not implemented.');
  }
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
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

  // ...Thêm các hàm khác nếu cần
}

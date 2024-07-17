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
    @InjectModel(Lesson.name) private readonly lessonModel: Model<Lesson>
  ) { }

  // Tạo chương mới
  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const newChapter = new this.chapterModel(createChapterDto);
    return await newChapter.save();
  }

  // Lấy tất cả bài học theo chapterId
  async findLessonsByChapterId(chapterId: Types.ObjectId): Promise<Lesson[]> {
    return await this.lessonModel.find({ chapter: chapterId }).exec();
  }

  // Lấy tất cả các chương
  async findAll(): Promise<Chapter[]> {
    return await this.chapterModel.find().exec();
  }

  // Lấy chương theo courseId
  async findByCourseId(courseId: string): Promise<Chapter[]> {
    return await this.chapterModel.find({ courseId }).exec();
  }

  // Lấy thông tin chương theo ID
  async findOne(id: string): Promise<Chapter> {
    const chapter = await this.chapterModel.findById(id).exec();
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return chapter;
  }

  // Cập nhật chương theo ID
  async update(id: string, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const updatedChapter = await this.chapterModel.findByIdAndUpdate(id, updateChapterDto, { new: true }).exec();
    if (!updatedChapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return updatedChapter;
  }

  // Cập nhật thứ tự các chương
  async updateChapterOrder(chapters: { id: string; chapterNumber: number }[]): Promise<any> {
    const session = await this.chapterModel.db.startSession();
    session.startTransaction();
    try {
      for (const { id, chapterNumber } of chapters) {
        const updateResult = await this.chapterModel.findByIdAndUpdate(id, { chapterNumber }, { session });
        console.log(updateResult); // Logging the result
      }
      await session.commitTransaction();
      return { status: 'success', message: 'Chapters order updated successfully' };
    } catch (error) {
      console.error('Error during transaction:', error); // Log detailed error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Xóa chương theo ID
  async remove(id: string): Promise<Chapter> {
    const deletedChapter = await this.chapterModel.findByIdAndRemove(id).exec();
    if (!deletedChapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return deletedChapter;
  }
}

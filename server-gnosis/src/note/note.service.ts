import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) { }

  // Tạo ghi chú mới
  async create(createNoteDto: any): Promise<Note> {
    const newNote = new this.noteModel(createNoteDto);
    return newNote.save();
  }

  // Lấy tất cả ghi chú của người dùng theo userId
  async findByUser(userId: string): Promise<Note[]> {
    return this.noteModel.find({ userUid: userId }).exec();
  }

  // Xóa ghi chú theo noteId
  async delete(noteId: string): Promise<Note> {
    return this.noteModel.findByIdAndDelete(noteId).exec();
  }

  // Cập nhật ghi chú theo noteId
  async update(noteId: string, updateNoteDto: any): Promise<Note> {
    const updatedNote = await this.noteModel.findByIdAndUpdate(noteId, updateNoteDto, { new: true }).exec();
    if (!updatedNote) {
      throw new Error('Note not found');
    }
    return updatedNote;
  }
}

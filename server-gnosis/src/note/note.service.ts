// src/notes/note.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './entities/note.entity';
import { Types } from 'mongoose';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) { }

  async create(createNoteDto: any): Promise<Note> {
    const newNote = new this.noteModel(createNoteDto);
    return newNote.save();
  }

  async findByUser(userId: string): Promise<Note[]> {
    return this.noteModel.find({ userUid: userId }).exec();
  }
  async delete(noteId: string): Promise<Note> {
    return this.noteModel.findByIdAndDelete(noteId).exec();
  }


  async update(noteId: string, updateNoteDto: any): Promise<Note> {
    const updatedNote = await this.noteModel.findByIdAndUpdate(noteId, updateNoteDto, { new: true }).exec();
    if (!updatedNote) {
      throw new Error('Note not found');
    }
    return updatedNote;
  }

}

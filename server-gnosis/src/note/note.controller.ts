import { Controller, Get, Param, Post, Body, NotFoundException, Delete, Patch } from '@nestjs/common';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) { }

  @Post()
  create(@Body() createNoteDto: any) {
    return this.noteService.create(createNoteDto);
  }


  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const notes = await this.noteService.findByUser(userId);
    if (!notes.length) {
      throw new NotFoundException('No notes found for this user');
    }
    return notes;
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedNote = await this.noteService.delete(id);
    if (!deletedNote) {
      throw new NotFoundException('Note not found');
    }
    return deletedNote;
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: any) {
    const note = await this.noteService.update(id, updateNoteDto);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }
}

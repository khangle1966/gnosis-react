// src/chapter/dto/create-chapter.dto.ts

export class CreateChapterDto {
    public chapterNumber: number;
    public courseId: string; // ID của khóa học mà chapter này thuộc về
    public title: string; // Tên chapter
    public lesson: string; // Tên chapter
}

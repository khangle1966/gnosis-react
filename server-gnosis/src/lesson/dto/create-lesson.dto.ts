export class CreateLessonDto {
  constructor(
    public ordinalnumber: number,
    public titleChapter: string,
    public chapterNumber: number,
    public title: string,
    public courseId: string,
    public content: string,
    public decription: string,
    public duration: number, // Thời lượng khóa học tính bằng giờ
  ) { }
}

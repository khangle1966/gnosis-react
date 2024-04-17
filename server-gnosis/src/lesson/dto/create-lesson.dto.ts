export class CreateLessonDto {
  constructor(
    public ordinalnumber: number,
    public chapterId: string,
    public title: string,
    public courseId: string,
    public description: string,
    public duration: number, // Thời lượng khóa học tính bằng giờ
  ) { }
}

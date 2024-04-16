export class CreateLessonDto {
<<<<<<< HEAD
    constructor(
      public ordinalnumber: number,
      public title: string,
      public courseId: string,
      public content: string,
      public decription: string,
    ) {}
  }
  
=======
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
>>>>>>> 916cca0 (a)

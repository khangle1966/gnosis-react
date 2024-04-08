export class CreateQuizDto {
    constructor(
        public title: string,
        public courseId: string,
        public content: string,
        public total: number,
        public duration: number,
        public passCond: number,
    ) { }
    // constructor(
    //   public title: string,
    //   public courseId: string,
    //   public img: string,
    //   public content: string,
    //   public total: number,
    //   public time: number,
    // ) {}
}

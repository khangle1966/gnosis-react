
export class CreateNoteDto {
    constructor(
        public userUid: string,
        public chapterId: string,
        public lessonId: string,
        public courseId :string,
        public duration: number,
        public lessonTitle: string,

    ) { }
}

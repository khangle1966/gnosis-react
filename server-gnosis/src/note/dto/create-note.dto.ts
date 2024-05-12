
export class CreateNoteDto {
    constructor(
        public userUid: string,
        public chapterId: string,
        public lessonId: string,
        public duration: number,

    ) { }
}

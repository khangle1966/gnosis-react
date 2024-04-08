export class CreateQuestionDto {
    constructor(
      public quizId: string,
      public quizBank: object,
      public ordinalNum: number,
    ) {}
  }
  
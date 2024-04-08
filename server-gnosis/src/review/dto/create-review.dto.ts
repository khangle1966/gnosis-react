export class CreateReviewDto {

    constructor(
        public quizId: string,
        public profileId: string,
        public score: number,
        public test: [
            {
                answer: string[],
                quizBankId: string,
            }
        ]
    ) { }
}

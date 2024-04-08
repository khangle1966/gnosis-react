/* eslint-disable prettier/prettier */
export class CreateQuizBankDto {
    constructor(
        public img: string,
        public question: string,
        public options: string[],
        public answerList: string[],
    ) { }
}

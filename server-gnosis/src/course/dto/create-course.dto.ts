export class CreateCourseDto {
    constructor(
        public name: string,
        public description: string,
        public img: string,
        public category: string,
        public rating: number,
        public language: string,
        public price: number,
        public author: string,
        public isReleased: boolean,

    ) { }
}




export class CreateCourseDto {
    constructor(
        public name: string,
        public description: string,
        public subTitle: string,
        public img: string,
        public numberofparticipants: string,
        public category: string,
        public rating: number,
        public language: string,
        public price: number,
        public author: string,
        public authorId: string,
        public isReleased: boolean,
        public duration: number, // Thời lượng khóa học tính bằng giờ
        public publishedDate: Date,
        public request: string,
        public describe: string,
        public numberOfStudents: number, // Số học viên đang theo học
        public numberOfReviews: number, // Số người đã đánh giá khóa học




    ) { }
}


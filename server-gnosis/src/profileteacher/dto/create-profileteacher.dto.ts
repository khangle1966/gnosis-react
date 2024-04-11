import internal from "stream";

export class CreateProfileteacherDto {
    constructor(
        public id: string,
        public userName: string,
        public displayName: string,
        public email: string,

        public country: string,
        public avatar: string,
        public gender: string,
        public courses: string[],
        public contact: string,
        public bio: string,
        public descriptions: string,
        public notifications: string[],
        public totalcourses: string[],
        public completedlessons: string[],
        public teacherrating: string[],
        public totalstudents: number,
        
    ) { }
}

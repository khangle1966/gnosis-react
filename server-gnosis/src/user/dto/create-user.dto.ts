export class CreateUserDto {
    constructor(
        public uid: string,
        public email: string,
        public password: string,
        public name: string,
        public picture: string,
        public profile: string,
        public role: string,
        public createdAt: Date,
        public isBanned: boolean = false,

    ) { }
}

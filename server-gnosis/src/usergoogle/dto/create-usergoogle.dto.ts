export class CreateUsergoogleDto {
    constructor(
        public uid: string,
        public email: string,
        public name: string,
        public picture: string,
        public profile: string,
        public role: string,
    ) { }
}
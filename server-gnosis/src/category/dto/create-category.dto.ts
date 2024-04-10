export class CreateCategoryDto {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        // Sử dụng kiểu optional cho trường này nếu bạn muốn hỗ trợ danh mục lồng nhau
    ) { }
}

export class CreateCategoryDto {
    constructor(
        public name: string,
        public description: string,
        public parentId?: string, // Sử dụng kiểu optional cho trường này nếu bạn muốn hỗ trợ danh mục lồng nhau
    ) { }
}

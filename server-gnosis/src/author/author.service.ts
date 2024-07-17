import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  // Tạo một tác giả mới
  create(createAuthorDto: CreateAuthorDto) {
    return 'This action adds a new author';
  }

  // Lấy tất cả tác giả
  findAll() {
    return `This action returns all author`;
  }

  // Lấy thông tin tác giả theo ID
  findOne(id: number) {
    return `This action returns a #${id} author`;
  }

  // Cập nhật thông tin tác giả theo ID
  update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return `This action updates a #${id} author`;
  }

  // Xóa tác giả theo ID
  remove(id: number) {
    return `This action removes a #${id} author`;
  }
}

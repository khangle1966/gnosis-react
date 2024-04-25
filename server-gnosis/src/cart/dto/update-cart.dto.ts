import { PartialType } from '@nestjs/mapped-types';

import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    public cartId: string;
    quantity: number;
    delete: boolean;
    courseId: string;
}



export class CreateCartDto {

    public cartId: string;  // ID của sản phẩm
    public quantity: number;  // Số lượng sản phẩm, ít nhất là 1
    public name: string
}

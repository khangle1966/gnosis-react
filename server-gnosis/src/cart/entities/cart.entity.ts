import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Cart {
    [x: string]: any;
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    cartId: Types.ObjectId;

    @Prop({ required: true, min: 1 })
    quantity: number;
    
    @Prop({ default: false })
    deleted: boolean;
}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);

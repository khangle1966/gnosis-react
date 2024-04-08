import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

export type QuizBankDocument = HydratedDocument<QuizBank>;

@Schema({ timestamps: true })
export class QuizBank {


    @Prop()
    question: string;

    @Prop()
    img: string;

    @Prop()
    options: string[];

    @Prop()
    answerList: string[];

}

export const QuizBankSchema = SchemaFactory.createForClass(QuizBank);

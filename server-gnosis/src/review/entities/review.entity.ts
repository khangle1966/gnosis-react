
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' })
    quizId: string;

    @Prop({ required: true })
    profileId: string;

    @Prop()
    score: number;


    @Prop(
        {
            type: [{
                answer: [String],
                quizBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizBank' },
            }]
        }
    )
    test: {
        answer: string[],
        quizBankId: string,
    }

}

export const ReviewSchema = SchemaFactory.createForClass(Review);


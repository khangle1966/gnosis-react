// src/rating/dto/create-rating.dto.ts

export class CreateRatingDto {
    readonly courseId: string;
    readonly userId: string;
    readonly rating: number;
    readonly feedback: string;
}

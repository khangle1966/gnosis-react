// src/lesson-completion/dto/create-lesson-completion.dto.ts

export class CreateLessonCompletionDto {
    readonly userId: string;
    readonly lessonId: string;
    readonly completed: boolean;
}

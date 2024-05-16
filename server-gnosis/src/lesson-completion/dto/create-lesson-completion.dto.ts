// src/lesson-completion/dto/create-lesson-completion.dto.ts

export class CreateLessonCompletionDto {
    readonly userId: string;
    readonly lessonId: string;
    readonly courseId: string;

    readonly completed: boolean;
}

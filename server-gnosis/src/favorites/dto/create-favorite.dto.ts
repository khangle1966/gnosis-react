import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
    @IsString()
    readonly userId: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    readonly courseIds: string[];

    @IsArray()
    @IsString({ each: true })
    readonly favorites: string[];
}

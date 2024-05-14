import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId, IsString, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateProfileDto {
    @IsOptional()
    @IsMongoId({ each: true })
    @Type(() => String)
    @Transform(({ value }) => Array.from(new Set(value)), { toClassOnly: true })
    @ApiPropertyOptional({ type: [String], description: 'Array of course IDs' })
    courses?: string[];

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Username' })
    readonly userName?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Email' })
    readonly email?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => Array.from(new Set(value)), { toClassOnly: true })
    @ApiPropertyOptional({ type: [String], description: 'Array of ongoing course IDs' })
    readonly ongoingCourse?: string[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => Array.from(new Set(value)), { toClassOnly: true })
    @ApiPropertyOptional({ type: [String], description: 'Array of completed course IDs' })
    readonly completedCourse?: string[];
}

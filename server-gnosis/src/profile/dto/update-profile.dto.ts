import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
    @IsOptional()
    @IsMongoId({ each: true })
    @Type(() => String)
    @ApiPropertyOptional({ type: [String], description: 'Array of course IDs' })
    courses?: string[];
}

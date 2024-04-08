import { PartialType } from '@nestjs/mapped-types';
import { CreateUsergoogleDto } from './create-usergoogle.dto';

export class UpdateUsergoogleDto extends PartialType(CreateUsergoogleDto) {}

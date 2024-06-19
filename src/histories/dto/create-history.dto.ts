import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { User } from '../../users/domain/user';
import { Summary } from '../../summary/domain/summary';
import { Analyzer } from '../../analyzer/domain/analyzer';

export class CreateHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  summaryId?: number;

  @ApiProperty()
  @IsOptional()
  analyzerId?: number;
}

export class CreateHistoryRelationalDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  user: User;

  @ApiProperty()
  @IsOptional()
  summary?: Summary;

  @ApiProperty()
  @IsOptional()
  analyzer?: Analyzer;
}

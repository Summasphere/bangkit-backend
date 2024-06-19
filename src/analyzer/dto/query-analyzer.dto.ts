import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Analyzer } from '../domain/analyzer';

// export class FilterAnalyzerDto {
//   @ApiPropertyOptional({ type: RoleDto })
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => RoleDto)
//   roles?: RoleDto[] | null;
// }

export class SortAnalyzerDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Analyzer;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryAnalyzerDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  // @ApiPropertyOptional({ type: String })
  // @IsOptional()
  // @Transform(({ value }) =>
  //   value ? plainToInstance(FilterUserDto, JSON.parse(value)) : undefined,
  // )
  // @ValidateNested()
  // @Type(() => FilterUserDto)
  // filters?: FilterUserDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortAnalyzerDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortAnalyzerDto)
  sort?: SortAnalyzerDto[] | null;
}

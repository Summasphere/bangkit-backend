import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { History } from '../domain/history';

// export class FilterHistoryDto {
//   @ApiPropertyOptional({ type: RoleDto })
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => RoleDto)
//   roles?: RoleDto[] | null;
// }

export enum HistoryType {
  ALL = 'all',
  SUMMARY = 'summary',
  ANALYZER = 'analyzer',
}

export class SortHistoryDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof History;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryHistoryDto {
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

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? value : HistoryType.ALL))
  @IsOptional()
  type?: HistoryType;

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
      ? plainToInstance(SortHistoryDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortHistoryDto)
  sort?: SortHistoryDto[] | null;
}

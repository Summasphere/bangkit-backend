import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Summary } from '../domain/summary';

// export class FilterSummaryDto {
//   @ApiPropertyOptional({ type: RoleDto })
//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => RoleDto)
//   roles?: RoleDto[] | null;
// }

export class SortSummaryDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Summary;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QuerySummaryDto {
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
      ? plainToInstance(SortSummaryDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortSummaryDto)
  sort?: SortSummaryDto[] | null;
}

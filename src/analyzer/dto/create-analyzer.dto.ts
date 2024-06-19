import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FileType } from '../../files/domain/file';

export class CreateAnalyzerDto {
  @ApiProperty()
  @IsOptional()
  urlInput?: string;
}

export class CreateAnalyzerRelationalDto {
  @ApiProperty()
  @IsOptional()
  urlInput?: string;

  @ApiProperty()
  @IsOptional()
  fileInput?: string;

  @ApiProperty()
  @IsNotEmpty()
  dataWordFrequency: string;

  @ApiProperty()
  @IsNotEmpty()
  file: FileType | null;

  @ApiProperty()
  @IsNotEmpty()
  dataPDF: string;

  @ApiProperty()
  @IsNotEmpty()
  dataLDA: string;
}

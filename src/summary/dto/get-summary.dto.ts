import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { FileType } from '../../files/domain/file';

export class GetSummaryDto {
    @ApiProperty()
    @IsOptional()
    textInput?: string;

    @ApiProperty()
    @IsOptional()
    fileInput?: string;

    @ApiProperty()
    @IsNotEmpty()
    length: number;

    @ApiProperty()
    @IsNotEmpty()
    file: FileType | null;

    @ApiProperty()
    @IsNotEmpty()
    dataPDF: string;
}

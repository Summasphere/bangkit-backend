import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetAnalyzerDto {
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
    dataLDA: string;

    @ApiProperty()
    @IsNotEmpty()
    dataPDF: string;
}

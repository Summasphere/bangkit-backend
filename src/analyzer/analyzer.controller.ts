import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  Request,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
  HttpException,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateAnalyzerDto } from './dto/create-analyzer.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalJwtAuthGuard } from '../auth/guard/optional.guard';
import { IsAuthenticated } from '../auth/decorator/authenticated.decorator';
import { BaseController, HttpResponse } from '../utils/basecontroller.controller';
import { GetAnalyzerDto } from './dto/get-analyzer.dto';
import { ApiPaginatedResponse } from '../utils/api-paginated.decorator';
import { PaginateOptions } from 'prisma-pagination';
import { PaginatedOutputDto } from '../utils/types/paginated.type';
import { analyzer } from '@prisma/client';
import ServiceFactoryEnum from '../service-factory/service-factory.enum';
import { MeGuard } from '../auth/guard/me.guard';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@ApiTags('Analyzer')
@Controller({
  path: 'analyzer',
  version: '1',
})
@Controller('analyzer')
export class AnalyzerController extends BaseController {
  constructor(private readonly analyzerService: AnalyzerService) {
    super();
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @ApiPaginatedResponse(GetAnalyzerDto)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: PaginateOptions,
  ): Promise<HttpResponse<PaginatedOutputDto<analyzer>>> {
    try {
      query.page ??= 1;
      query.perPage ??= 10;
      const analyzers = await this.analyzerService.findManyWithPagination(query);
      const response = this.responseSuccess<PaginatedOutputDto<analyzer>>(
        'Analyzers found',
        analyzers,
      );

      return response;
    } catch (error) {
      if (!(error instanceof HttpException))
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

      throw error;
    }
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  @SetMetadata('serviceName', ServiceFactoryEnum.AnalyzerService)
  @UseGuards(MeGuard)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: number,
    @Res() res
  ): Promise<HttpResponse<analyzer>> {
    try {
      const analyzer = await this.analyzerService.findOne({ id });
      const response = this.responseSuccess<analyzer>('Analyzer found', analyzer);

      res.status(HttpStatus.OK).json(response);

      return response;
    } catch (error) {
      if (!(error instanceof HttpException))
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

      throw error;
    }
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Delete(':id')
  @SetMetadata('serviceName', ServiceFactoryEnum.SummaryService)
  @UseGuards(MeGuard)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.analyzerService.delete(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @IsAuthenticated() isAuthenticated: boolean,
    @Request() req,
    @Body() createAnalyzerDto: CreateAnalyzerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }), // 1MB
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Res() res,
  ) {
    try {
      const user: JwtPayloadType | undefined = req.user;

      if (!isAuthenticated && req.headers.authorization !== undefined)
        throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);

      const response = this.responseSuccess(
        'Analyzer created successfully',
        await this.analyzerService.create(createAnalyzerDto, file, user, 'frontend'),
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      if (!(error instanceof HttpException))
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

      throw error;
    }
  }
}

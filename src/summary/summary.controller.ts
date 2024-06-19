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
import { SummaryService } from './summary.service';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { OptionalJwtAuthGuard } from '../auth/guard/optional.guard';
import { IsAuthenticated } from '../auth/decorator/authenticated.decorator';
import { BaseController, HttpResponse } from '../utils/basecontroller.controller';
import { GetSummaryDto } from './dto/get-summary.dto';
import { ApiPaginatedResponse } from '../utils/api-paginated.decorator';
import { PaginatedOutputDto } from '../utils/types/paginated.type';
import { summary } from '@prisma/client';
import { PaginateOptions } from 'prisma-pagination';
import ServiceFactoryEnum from '../service-factory/service-factory.enum';
import { MeGuard } from '../auth/guard/me.guard';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@ApiTags('Summary')
@Controller({
  path: 'summary',
  version: '1',
})
@Controller('summary')
export class SummaryController extends BaseController {
  constructor(private readonly summaryService: SummaryService) {
    super();
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @ApiPaginatedResponse(GetSummaryDto)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: PaginateOptions,
  ): Promise<HttpResponse<PaginatedOutputDto<summary>>> {
    try {
      query.page ??= 1;
      query.perPage ??= 10;
      const summaries = await this.summaryService.findManyWithPagination(query);
      const response = this.responseSuccess<PaginatedOutputDto<summary>>(
        'Summaries found',
        summaries,
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
  @SetMetadata('serviceName', ServiceFactoryEnum.SummaryService)
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
  ): Promise<HttpResponse<summary>> {
    try {
      const summary = await this.summaryService.findOne({ id });
      const response = this.responseSuccess<summary>('Summary found', summary);

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
    try {
      return this.summaryService.delete(id);
    } catch (error) {
      if (!(error instanceof HttpException))
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @IsAuthenticated() isAuthenticated: boolean,
    @Request() req,
    @Body() createSummaryDto: CreateSummaryDto,
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
  ): Promise<HttpResponse<string>> {
    try {
      const user: JwtPayloadType | undefined = req.user;

      if (!isAuthenticated && req.headers.authorization !== undefined)
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

      const create = await this.summaryService.create(createSummaryDto, file, user);
      console.log(create);
      const response = this.responseSuccess(
        'Summary created successfully',
        create,
      );

      res.status(HttpStatus.OK).json(response);

      return response;
    } catch (error) {
      if (!(error instanceof HttpException))
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

      throw error;
    }
  }
}

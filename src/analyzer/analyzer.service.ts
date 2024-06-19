import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AnalyzerRepository } from './infrastructure/persistence/analyzer.repository';
import {
  CreateAnalyzerDto,
  CreateAnalyzerRelationalDto,
} from './dto/create-analyzer.dto';
import { IFile } from '../utils/types/file.type';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { HistoriesService } from '../histories/histories.service';
import { CreateHistoryDto } from '../histories/dto/create-history.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Prisma, analyzer } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PaginateOptions, createPaginator } from 'prisma-pagination';
import { PaginatedOutputDto } from '../utils/types/paginated.type';

@Injectable()
export class AnalyzerService {
  constructor(
    private readonly analyzerRepository: AnalyzerRepository,
    private readonly historyService: HistoriesService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) { }

  async create(
    createAnalyzerDto: CreateAnalyzerDto,
    fileInput: IFile,
    user: JwtPayloadType | undefined,
    media: "frontend" | "android"
  ): Promise<string> {
    if (createAnalyzerDto.urlInput === null && fileInput === null)
      throw new HttpException(
        'Either url input or file input is required',
        HttpStatus.BAD_REQUEST,
      );

    let result: AxiosResponse | null = null;

    const request = new FormData();

    let mode = "link";
    request.append('media', media);

    if (fileInput !== undefined)
      mode = "pdf"

    request.append('mode', mode);

    if (createAnalyzerDto.urlInput !== undefined)
      request.append('url', createAnalyzerDto.urlInput!);

    if (fileInput !== undefined) {
      const blob: Blob = new Blob([fileInput.buffer]);
      request.append('file', blob);
    }

    try {
      result = await firstValueFrom(
        this.httpService.post(process.env.MACHINELEARNING_DOMAIN! + "/analyzer", request),
      );
    } catch (error) {
      throw new HttpException(
        'Error in machine learning service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (user) {
      const createAnalyzerRelationalDto: CreateAnalyzerRelationalDto =
        new CreateAnalyzerRelationalDto();
      createAnalyzerRelationalDto.urlInput =
        createAnalyzerDto.urlInput ?? undefined;
      createAnalyzerRelationalDto.fileInput =
        fileInput === null ? undefined : fileInput?.originalname;
      createAnalyzerRelationalDto.dataWordFrequency = JSON.stringify({});
      createAnalyzerRelationalDto.dataPDF = JSON.stringify({});
      createAnalyzerRelationalDto.dataLDA = JSON.stringify({});

      const analyzer = await this.analyzerRepository.create(
        createAnalyzerRelationalDto,
      );

      const createHistoryDto: CreateHistoryDto = new CreateHistoryDto();
      createHistoryDto.title =
        createAnalyzerRelationalDto.fileInput ??
        createAnalyzerRelationalDto.urlInput?.substring(0, 50) ??
        'Analyzer';
      createHistoryDto.analyzerId = analyzer.id;
      await this.historyService.create(user, createHistoryDto, null, analyzer);
    }

    return result?.data;
  }

  async findManyWithPagination(query: PaginateOptions): Promise<PaginatedOutputDto<analyzer>> {
    const paginate = createPaginator(query);

    return paginate<analyzer, Prisma.analyzerFindManyArgs>(
      this.prismaService.analyzer,
      {
        where: {},
        orderBy: {
          id: 'desc',
        },
      },
      {
        page: query.page,
      },
    );
  }

  async findOne(fields: Prisma.analyzerWhereInput): Promise<analyzer | null> {
    const analyzer = await this.prismaService.analyzer.findFirst({
      where: fields,
    });

    if (!analyzer) {
      throw new HttpException(`Analyzer with id ${fields.id} doesn't exists`, HttpStatus.NOT_FOUND);
    }
    return analyzer;
  }

  async delete(id: analyzer['id']) {
    const analyzer = await this.prismaService.analyzer.delete({
      where: { id },
    });

    if (!analyzer) {
      throw new HttpException(`Analyzer with id ${id} doesn't exists`, HttpStatus.NOT_FOUND);
    }
  }

  async isMine(userId: number, resourceId: number): Promise<boolean> {
    if (isNaN(resourceId)) {
      throw new HttpException('Bad resource request', HttpStatus.BAD_REQUEST);
    }

    const analyzer = await this.findOne({ id: resourceId });
    if (!analyzer) {
      throw new HttpException('Analyzer not found', HttpStatus.NOT_FOUND);
    }
    const history = await this.prismaService.history.findFirst({ where: { analyzerId: resourceId, userId: userId } });

    return !!history;
  }
}

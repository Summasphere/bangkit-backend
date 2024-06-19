import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SummaryRepository } from './infrastructure/persistence/summary.repository';
import {
  CreateSummaryDto,
  CreateSummaryRelationalDto,
} from './dto/create-summary.dto';
import { IFile } from '../utils/types/file.type';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { HistoriesService } from '../histories/histories.service';
import { CreateHistoryDto } from '../histories/dto/create-history.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { summary, Prisma } from '@prisma/client'
import { PaginatedOutputDto } from '../utils/types/paginated.type';
import { PaginateOptions, createPaginator } from 'prisma-pagination';
import { PrismaService } from '../prisma/prisma.service';
import { IService } from '../service-factory/service-factory.interface';
import { isValidUrl } from '../utils/url.validator';

@Injectable()
export class SummaryService implements IService {
  constructor(
    private readonly summaryRepository: SummaryRepository,
    private readonly historyService: HistoriesService,
    private readonly httpService: HttpService,
    private readonly prismaService: PrismaService,
  ) { }

  async create(
    createSummaryDto: CreateSummaryDto,
    fileInput: IFile,
    user: JwtPayloadType | undefined,
  ): Promise<string> {
    if (createSummaryDto.urlInput !== undefined && !isValidUrl(createSummaryDto.urlInput))
      throw new HttpException('Invalid URL', HttpStatus.BAD_REQUEST);

    if (createSummaryDto.textInput === undefined && fileInput === undefined && createSummaryDto.urlInput === undefined)
      throw new HttpException(
        'Either text input, url input or file input is required',
        HttpStatus.BAD_REQUEST,
      );

    let result: AxiosResponse | null = null;

    const request = new FormData();

    let mode = "text";

    if (createSummaryDto.urlInput !== undefined)
      mode = "link";
    else if (fileInput !== undefined)
      mode = "pdf";

    request.append('mode', mode);

    if (createSummaryDto.textInput !== undefined)
      request.append('text', createSummaryDto.textInput!);

    if (createSummaryDto.urlInput !== undefined)
      request.append('url', createSummaryDto.urlInput!);

    if (fileInput !== undefined) {
      const blob: Blob = new Blob([fileInput.buffer]);
      request.append('file', blob);
    }

    try {
      console.log(request)
      const url = process.env.MACHINELEARNING_DOMAIN! + (createSummaryDto.model === 'basic' ? '/summarize/bart' : '/summarize/gemini');
      result = await firstValueFrom(
        this.httpService.post(url, request),
      );
    } catch (error) {
      throw new HttpException(
        'Error in machine learning service',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (user) {
      const createSummaryRelationalDto: CreateSummaryRelationalDto =
        new CreateSummaryRelationalDto();
      createSummaryRelationalDto.textInput =
        createSummaryDto.textInput ?? undefined;
      createSummaryRelationalDto.fileInput =
        fileInput === null ? undefined : fileInput?.originalname;
      createSummaryRelationalDto.length = 0;
      createSummaryRelationalDto.dataPDF = JSON.stringify({});

      const summary = await this.summaryRepository.create(
        createSummaryRelationalDto,
      );

      const createHistoryDto: CreateHistoryDto = new CreateHistoryDto();
      createHistoryDto.title =
        createSummaryRelationalDto.fileInput ??
        createSummaryRelationalDto.textInput?.substring(0, 50) ??
        'Summary';
      createHistoryDto.summaryId = summary.id;
      await this.historyService.create(user, createHistoryDto, summary, null);
    }

    return result?.data;
  }

  async findManyWithPagination(query: PaginateOptions): Promise<PaginatedOutputDto<summary>> {
    const paginate = createPaginator(query);

    return paginate<summary, Prisma.summaryFindManyArgs>(
      this.prismaService.summary,
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

  async findOne(fields: Prisma.summaryWhereInput): Promise<summary | null> {
    const summary = await this.prismaService.summary.findFirst({
      where: fields,
    });

    if (!summary) {
      throw new HttpException(`Summary with id ${fields.id} doesn't exists`, HttpStatus.NOT_FOUND);
    }
    return summary;
  }

  async delete(id: summary['id']) {
    const summary = await this.prismaService.summary.delete({
      where: { id },
    });

    if (!summary) {
      throw new HttpException(`Summary with id ${id} doesn't exists`, HttpStatus.NOT_FOUND);
    }
  }

  async isMine(userId: number, resourceId: number): Promise<boolean> {
    if (isNaN(resourceId)) {
      throw new HttpException('Bad resource request', HttpStatus.BAD_REQUEST);
    }

    const summary = await this.findOne({ id: resourceId });
    if (!summary) {
      throw new HttpException('Summary not found', HttpStatus.NOT_FOUND);
    }
    const history = await this.prismaService.history.findFirst({ where: { summaryId: resourceId, userId: userId } });

    return !!history;
  }
}

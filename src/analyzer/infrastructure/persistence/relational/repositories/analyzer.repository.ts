import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { AnalyzerRepository } from '../../analyzer.repository';
import { AnalyzerEntity } from '../entities/analyzer.entity';
import { Analyzer } from '../../../../domain/analyzer';
import { AnalyzerMapper } from '../mappers/analyzer.mapper';
import { SortAnalyzerDto } from '../../../../dto/query-analyzer.dto';

@Injectable()
export class AnalyzerRelationalRepository implements AnalyzerRepository {
  constructor(
    @InjectRepository(AnalyzerEntity)
    private readonly historiesRepository: Repository<AnalyzerEntity>,
  ) {}

  async create(data: Analyzer): Promise<Analyzer> {
    const persistenceModel = AnalyzerMapper.toPersistence(data);
    const newEntity = await this.historiesRepository.save(
      this.historiesRepository.create(persistenceModel),
    );
    return AnalyzerMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortAnalyzerDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Analyzer[]> {
    const where: FindOptionsWhere<AnalyzerEntity> = {};
    const entities = await this.historiesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((analyzer) => AnalyzerMapper.toDomain(analyzer));
  }

  async findOne(
    fields: EntityCondition<Analyzer>,
  ): Promise<NullableType<Analyzer>> {
    const entity = await this.historiesRepository.findOne({
      where: fields as FindOptionsWhere<AnalyzerEntity>,
    });

    return entity ? AnalyzerMapper.toDomain(entity) : null;
  }

  async softDelete(id: Analyzer['id']): Promise<void> {
    await this.historiesRepository.softDelete(id);
  }
}

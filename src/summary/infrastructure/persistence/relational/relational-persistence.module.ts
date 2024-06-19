import { Module } from '@nestjs/common';
import { SummaryRepository } from '../summary.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryEntity } from './entities/summary.entity';
import { SummaryRelationalRepository } from './repositories/summary.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SummaryEntity])],
  providers: [
    {
      provide: SummaryRepository,
      useClass: SummaryRelationalRepository,
    },
  ],
  exports: [SummaryRepository],
})
export class RelationalSummaryPersistenceModule {}

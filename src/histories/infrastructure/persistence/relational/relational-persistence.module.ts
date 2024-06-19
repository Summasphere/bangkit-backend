import { Module } from '@nestjs/common';
import { HistoryRepository } from '../histories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from './entities/history.entity';
import { HistoriesRelationalRepository } from './repositories/history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity])],
  providers: [
    {
      provide: HistoryRepository,
      useClass: HistoriesRelationalRepository,
    },
  ],
  exports: [HistoryRepository],
})
export class RelationalHistoryPersistenceModule {}

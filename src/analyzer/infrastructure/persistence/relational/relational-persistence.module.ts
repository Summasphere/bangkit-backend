import { Module } from '@nestjs/common';
import { AnalyzerRepository } from '../analyzer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyzerEntity } from './entities/analyzer.entity';
import { AnalyzerRelationalRepository } from './repositories/analyzer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyzerEntity])],
  providers: [
    {
      provide: AnalyzerRepository,
      useClass: AnalyzerRelationalRepository,
    },
  ],
  exports: [AnalyzerRepository],
})
export class RelationalAnalyzerPersistenceModule {}

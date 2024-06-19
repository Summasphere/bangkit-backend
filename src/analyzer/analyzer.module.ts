import { Module, forwardRef } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { AnalyzerController } from './analyzer.controller';
import { RelationalAnalyzerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { HistoriesModule } from '../histories/histories.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceFactoryModule } from '../service-factory/service-factory.module';

const infrastructurePersistenceModule = RelationalAnalyzerPersistenceModule;

@Module({
  imports: [
    UsersModule,
    forwardRef(() => HistoriesModule),
    HttpModule,
    PrismaModule,
    infrastructurePersistenceModule,
    forwardRef(() => ServiceFactoryModule),
  ],
  controllers: [AnalyzerController],
  providers: [AnalyzerService],
  exports: [AnalyzerService, infrastructurePersistenceModule],
})
export class AnalyzerModule { }

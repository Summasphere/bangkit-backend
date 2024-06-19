import { Module, forwardRef } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryController } from './summary.controller';
import { RelationalSummaryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { HistoriesModule } from '../histories/histories.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceFactoryModule } from '../service-factory/service-factory.module';

const infrastructurePersistenceModule = RelationalSummaryPersistenceModule;

@Module({
  imports: [
    UsersModule,
    forwardRef(() => HistoriesModule),
    HttpModule,
    infrastructurePersistenceModule,
    PrismaModule,
    forwardRef(() => ServiceFactoryModule),
  ],
  controllers: [SummaryController],
  providers: [SummaryService],
  exports: [SummaryService, infrastructurePersistenceModule],
})
export class SummaryModule { }

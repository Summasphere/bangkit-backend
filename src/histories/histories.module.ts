import { Module, forwardRef } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { RelationalHistoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';
import { ServiceFactoryModule } from '../service-factory/service-factory.module';

const infrastructurePersistenceModule = RelationalHistoryPersistenceModule;

@Module({
  imports: [
    UsersModule,
    infrastructurePersistenceModule,
    forwardRef(() => ServiceFactoryModule),
  ],
  controllers: [HistoriesController],
  providers: [HistoriesService],
  exports: [HistoriesService, infrastructurePersistenceModule],
})
export class HistoriesModule {}

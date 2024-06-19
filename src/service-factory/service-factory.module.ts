import { Module, forwardRef } from '@nestjs/common';
import { ServiceFactory } from './service-factory.factory';
import { HistoriesModule } from '../histories/histories.module';
import { SummaryModule } from '../summary/summary.module';
import { AnalyzerModule } from '../analyzer/analyzer.module';

@Module({
  providers: [ServiceFactory],
  imports: [
    forwardRef(() => HistoriesModule),
    forwardRef(() => SummaryModule),
    forwardRef(() => AnalyzerModule)
  ],
  exports: [ServiceFactory],
})
export class ServiceFactoryModule { }

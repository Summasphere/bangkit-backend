import { Injectable } from '@nestjs/common';
import { IService } from './service-factory.interface';
import { HistoriesService } from '../histories/histories.service';
import { SummaryService } from '../summary/summary.service';
import { AnalyzerService } from '../analyzer/analyzer.service';

@Injectable()
export class ServiceFactory {
  constructor(
    private readonly historiesService: HistoriesService,
    private readonly summaryService: SummaryService,
    private readonly analyzerService: AnalyzerService,
  ) { }

  public getService(serviceName: string): IService {
    switch (serviceName) {
      case 'HistoriesService':
        return this.historiesService;
      case 'SummaryService':
        return this.summaryService;
      case 'AnalyzerService':
        return this.analyzerService;
    }
    return this.historiesService;
  }
}

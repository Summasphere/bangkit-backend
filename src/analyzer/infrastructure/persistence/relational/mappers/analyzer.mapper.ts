import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { Analyzer } from '../../../../domain/analyzer';
import { AnalyzerEntity } from '../entities/analyzer.entity';

export class AnalyzerMapper {
  static toDomain(raw: AnalyzerEntity): Analyzer {
    const analyzer = new Analyzer();
    analyzer.id = raw.id;
    analyzer.urlInput = raw.urlInput;
    // analyzer.analyzer = raw.analyzer;
    // analyzer.analyzer = raw.analyzer;
    analyzer.fileInput = raw.fileInput;
    analyzer.dataWordFrequency = raw.dataWordFrequency;
    analyzer.dataLDA = raw.dataLDA;
    analyzer.dataPDF = raw.dataPDF;
    analyzer.file = raw.file;
    return analyzer;
  }

  static toPersistence(analyzer: Analyzer): AnalyzerEntity {
    const file: FileEntity = new FileEntity();
    // file.id = analyzer.file.id; //noted

    const analyzerEntity = new AnalyzerEntity();
    if (analyzer.id && typeof analyzer.id === 'number') {
      analyzerEntity.id = analyzer.id;
    }

    analyzerEntity.urlInput = analyzer.urlInput;
    // analyzerEntity.analyzer = analyzer.analyzer;
    // analyzerEntity.analyzer = analyzer.analyzer;
    analyzerEntity.file = file;
    analyzerEntity.fileInput = analyzer.fileInput;
    analyzerEntity.dataWordFrequency = analyzer.dataWordFrequency;
    analyzerEntity.dataLDA = analyzer.dataLDA;
    analyzerEntity.dataPDF = analyzer.dataPDF;
    return analyzerEntity;
  }
}

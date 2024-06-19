import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { Summary } from '../../../../domain/summary';
import { SummaryEntity } from '../entities/summary.entity';

export class SummaryMapper {
  static toDomain(raw: SummaryEntity): Summary {
    const summary = new Summary();
    summary.id = raw.id;
    summary.textInput = raw.textInput;
    // summary.summary = raw.summary;
    // summary.analyzer = raw.analyzer;
    summary.fileInput = raw.fileInput;
    summary.length = raw.length;
    summary.dataPDF = raw.dataPDF;
    summary.file = raw.file;
    return summary;
  }

  static toPersistence(summary: Summary): SummaryEntity {
    const file: FileEntity = new FileEntity();
    // file.id = summary.file.id; //noted

    const summaryEntity = new SummaryEntity();
    if (summary.id && typeof summary.id === 'number') {
      summaryEntity.id = summary.id;
    }

    summaryEntity.textInput = summary.textInput;
    // summaryEntity.summary = summary.summary;
    // summaryEntity.analyzer = summary.analyzer;
    summaryEntity.file = file;
    summaryEntity.fileInput = summary.fileInput;
    summaryEntity.length = summary.length;
    summaryEntity.dataPDF = summary.dataPDF;
    return summaryEntity;
  }
}

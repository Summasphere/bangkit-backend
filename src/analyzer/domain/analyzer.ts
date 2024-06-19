import { Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';

export class Analyzer {
  id: number;
  @Expose({ groups: ['me', 'admin'] })
  urlInput?: string;
  fileInput?: string;
  dataWordFrequency: string;
  dataLDA: string;
  dataPDF: string;
  file: FileType | null;
}

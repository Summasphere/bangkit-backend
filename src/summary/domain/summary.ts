import { Expose } from 'class-transformer';
import { FileType } from '../../files/domain/file';

export class Summary {
  id: number;
  @Expose({ groups: ['me', 'admin'] })
  textInput?: string;
  fileInput?: string;
  length: number;
  dataPDF: string;
  file: FileType | null;
}

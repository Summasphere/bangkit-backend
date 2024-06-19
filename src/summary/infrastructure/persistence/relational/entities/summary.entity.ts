import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { Expose } from 'class-transformer';
import { Summary } from '../../../../domain/summary';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { HistoryEntity } from '../../../../../histories/infrastructure/persistence/relational/entities/history.entity';

@Entity({
  name: 'summary',
})
export class SummaryEntity extends EntityRelationalHelper implements Summary {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: false, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  textInput?: string;

  @Column({ type: String, unique: false, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  fileInput?: string;

  @Column({ type: Number, unique: false, nullable: false })
  @Expose({ groups: ['me', 'admin'] })
  length: number;

  @Column({ type: String, unique: false, nullable: false })
  @Expose({ groups: ['me', 'admin'] })
  dataPDF: string;

  @OneToOne(
    () => HistoryEntity,
    (historyEntity: HistoryEntity) => historyEntity.summary,
  )
  history: HistoryEntity;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  file: FileEntity;
}

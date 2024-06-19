import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { Expose } from 'class-transformer';
import { History } from '../../../../domain/history';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { SummaryEntity } from '../../../../../summary/infrastructure/persistence/relational/entities/summary.entity';
import { AnalyzerEntity } from '../../../../../analyzer/infrastructure/persistence/relational/entities/analyzer.entity';

@Entity({
  name: 'history',
})
export class HistoryEntity extends EntityRelationalHelper implements History {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: false, nullable: false })
  @Expose({ groups: ['me', 'admin'] })
  title: string;

  @OneToOne(
    () => SummaryEntity,
    (summaryEntity: SummaryEntity) => summaryEntity.history,
    {
      nullable: true,
    },
  )
  @JoinColumn([{ name: 'summaryId', referencedColumnName: 'id' }])
  summary: SummaryEntity | null;

  @Column({ type: Number, unique: false, nullable: true })
  summaryId: number | null;

  @OneToOne(
    () => AnalyzerEntity,
    (analyzerEntity: AnalyzerEntity) => analyzerEntity.history,
    {
      nullable: true,
    },
  )
  @JoinColumn([{ name: 'analyzerId', referencedColumnName: 'id' }])
  analyzer: AnalyzerEntity | null;

  @Column({ type: Number, unique: false, nullable: true })
  analyzerId: number | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

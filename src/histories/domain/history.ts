import { Expose } from 'class-transformer';
import { User } from '../../users/domain/user';
import { SafeUser } from '../../users/domain/safe-user';
import { Summary } from '../../summary/domain/summary';
import { Analyzer } from '../../analyzer/domain/analyzer';

export class History {
  id: number;

  @Expose({ groups: ['me', 'admin'] })
  title: string;
  summary?: Summary | null;
  analyzer?: Analyzer | null;
  user: User | SafeUser;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

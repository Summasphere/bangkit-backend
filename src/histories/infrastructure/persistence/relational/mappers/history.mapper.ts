import { SummaryEntity } from '../../../../../summary/infrastructure/persistence/relational/entities/summary.entity';
import { SafeUser } from '../../../../../users/domain/safe-user';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { History } from '../../../../domain/history';
import { HistoryEntity } from '../entities/history.entity';

export class HistoryMapper {
  static toDomain(raw: HistoryEntity): History {
    const history = new History();
    history.id = raw.id;
    history.title = raw.title;
    // history.summary = raw.summary;
    // history.analyzer = raw.analyzer;

    const safeUser: SafeUser = new SafeUser();
    safeUser.id = raw.user.id;
    safeUser.email = raw.user.email;
    history.user = safeUser;

    history.createdAt = raw.createdAt;
    history.updatedAt = raw.updatedAt;
    history.deletedAt = raw.deletedAt;
    return history;
  }

  static toPersistence(history: History): HistoryEntity {
    const user: UserEntity = new UserEntity();
    user.id = history.user.id;

    const historyEntity = new HistoryEntity();
    if (history.id && typeof history.id === 'number') {
      historyEntity.id = history.id;
    }

    const summary: SummaryEntity = new SummaryEntity();
    if (history.summary?.id) summary.id = history.summary?.id;

    historyEntity.title = history.title;
    historyEntity.summary = summary;
    // historyEntity.analyzer = history.analyzer;
    historyEntity.user = user;
    historyEntity.createdAt = history.createdAt;
    historyEntity.updatedAt = history.updatedAt;
    historyEntity.deletedAt = history.deletedAt;
    return historyEntity;
  }
}

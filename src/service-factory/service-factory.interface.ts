export interface IService {
  isMine(userId, resourceId): Promise<boolean>;
}

import { Expose } from 'class-transformer';

export class SafeUser {
  id: number;

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;
}

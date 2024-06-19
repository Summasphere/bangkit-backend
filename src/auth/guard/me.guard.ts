import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { ServiceFactory } from '../../service-factory/service-factory.factory';
import { Reflector } from '@nestjs/core';

@Injectable()
export class MeGuard implements CanActivate {
  constructor(
    @Inject(ServiceFactory)
    private readonly serviceFactory: ServiceFactory,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const serviceName: string = this.reflector.get<string>(
      'serviceName',
      context.getHandler(),
    );
    const service = this.serviceFactory.getService(serviceName);
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const resourceId = request.params.id;
    return service.isMine(userId, resourceId);
  }
}

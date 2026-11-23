import {CanActivate,ExecutionContext,ForbiddenException,Injectable} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
 
  private readonly expectedToken =
    process.env.ADMIN_TOKEN || 'admin-secret-token';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || authHeader !== this.expectedToken) {
      throw new ForbiddenException('Token de autorización inválido');}

    return true;
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(
        map((data) => ({
          status: HttpStatus.OK,
          timestamp: new Date().toISOString(),
          ...{ data },
        })),
      );
  }
}

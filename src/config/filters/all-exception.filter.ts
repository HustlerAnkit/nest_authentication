import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch()
export class AllExceptionFilter implements ExceptionFilter{
    constructor(private readonly httpAdapterHost: HttpAdapterHost){}

    catch(exception: unknown, host: ArgumentsHost){
            const { httpAdapter  } = this.httpAdapterHost;
            const ctx = host.switchToHttp();
            const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
            const errorMsg = exception instanceof HttpException ? exception.message : 'Internal server error';

            const responseBody = {
                success: false,
                statusCode: httpStatus,
                error: errorMsg,
                timestamp: new Date().toISOString(),
                path: httpAdapter.getRequestUrl(ctx.getRequest())
            }

            httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
    }
}
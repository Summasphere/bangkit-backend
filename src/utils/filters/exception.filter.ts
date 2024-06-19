import {
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  Catch,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    let msg: string | object = exception.getResponse();
    const status = exception.getStatus();


    if (typeof msg === 'object') {
      if (msg['message'] != undefined)
        msg = msg['message'];
      else if (msg['errors'] != undefined)
        msg = msg['errors']
    }

    response.status(status).json({
      code: status,
      status: 'error',
      message: msg,
    });
  }
}

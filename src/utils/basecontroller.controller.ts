export type HttpResponse<T> = {
  code: number;
  status: string;
  message?: string;
  data?: T;
};

export class BaseController {
  constructor() { }

  protected responseError(message: string, code: number = 400): HttpResponse<undefined> {
    return {
      code,
      status: 'error',
      message,
    };
  }

  protected responseSuccess<T>(
    message: string | null = null,
    data: T | null = null,
    code: number = 200,
  ): HttpResponse<T> {
    const response: HttpResponse<T> = {
      code,
      status: 'success',
    };
    response['code'] = code;
    response['status'] = 'success';
    if (message) response['message'] = message;
    if (data) response['data'] = data;

    return response;
  }
}

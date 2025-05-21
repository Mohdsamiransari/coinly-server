export class BaseResponseDto<T> {
  status: 'success' | 'failure';
  message: string;
  data?: T;

  constructor(status: 'success' | 'failure', message: string, data?: T) {
    this.status = status;
    this.message = message;
    if (data !== undefined) this.data = data;
  }
}

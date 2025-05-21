import { BaseResponseDto } from './base-response.dto';

export class ErrorResponseDto<T> extends BaseResponseDto<T> {
  constructor(message: string, data?: T) {
    super('failure', message, data);
  }
}

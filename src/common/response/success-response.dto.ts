import { BaseResponseDto } from './base-response.dto';

export class SuccessResponseDto<T> extends BaseResponseDto<T> {
  constructor(message: string, data?: T) {
    super('success', message, data);
  }
}

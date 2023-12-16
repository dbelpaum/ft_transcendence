import { Injectable, ValidationPipe } from '@nestjs/common';
import { ServerException } from 'src/game/ServerExceptions';
import { SocketExceptions } from 'src/game/shared/server/SocketExceptions';

@Injectable()
export class WsValidationPipe extends ValidationPipe
{
  createExceptionFactory()
  {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new ServerException(SocketExceptions.UnexpectedError, 'Bad request');
      }

      const errors = this.flattenValidationErrors(validationErrors);

      return new ServerException(SocketExceptions.UnexpectedPayload, errors);
    };
  }
}
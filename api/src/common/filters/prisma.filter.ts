import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter implements ExceptionFilter {
  catch(exc: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    if (exc.code === 'P2002') {
      return res.status(HttpStatus.CONFLICT).json({
        success: false,
        message: `${exc.meta?.target} is already taken. Please try another one`,
      });
    }

    if (exc.code === 'P2025') {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: `An operation failed because it depends on one or more records that were required but not found`,
      });
    }

    if (exc.code === 'P2005') {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: `The value {field_value} stored in the database for the field {field_name} is invalid for the field's type`,
      });
    }
    if (exc.code === 'P2015') {
      return res.json({
        success: false,
        message: `A related record could not be found`,
      });
    }
  }
}

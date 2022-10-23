// reference
// https://github.com/Onix-Systems/nest-js-boilerplate/blob/a07fa6bfa313b29eddab703ab2850c8ea103ed19/generators/auth/templates/mongodb/jwt/src/pipes/parse-object-id.pipe.ts

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export default class ParseObjectIdPipe implements PipeTransform<any, ObjectId> {
  public transform(value: string): ObjectId {
    try {
      return ObjectId.createFromHexString(value);
    } catch (error) {
      throw new BadRequestException('Validation failed (ObjectId is expected)');
    }
  }
}

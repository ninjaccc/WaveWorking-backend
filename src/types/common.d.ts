type WithMongooseId<T> = T & { _id: import('mongoose').Types.ObjectId };

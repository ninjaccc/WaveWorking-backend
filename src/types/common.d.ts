type WithMongooseId<T> = T & { _id: import('mongoose').Types.ObjectId };

interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UserModel'),
  CoordinatesService: Symbol.for('CoordinatesService'),
  CoordinatesModel: Symbol.for('CoordinatesModel'),
} as const;

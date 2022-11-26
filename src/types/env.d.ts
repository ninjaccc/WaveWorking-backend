declare namespace NodeJS {
  interface ProcessEnv {
    MONGO_DB_NAME: string;
    MONGO_NAME: string;
    MONGO_PASSWORD: string;
    CHANNEL_SALT: string;
    JWT_SECRET: string;
    JWT_EXPIRES_DAY: string;
  }
}

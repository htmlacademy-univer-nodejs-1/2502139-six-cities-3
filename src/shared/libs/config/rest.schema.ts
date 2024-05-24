import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_DIRECTORY: string;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Порт для входящих подключений',
    format: 'port',
    env: 'PORT',
    default: 8080,
  },
  DB_HOST: {
    doc: 'Адрес сервера баз данных',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  SALT: {
    doc: 'Случайный набор символов для генерации хеша паролей',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_USER: {
    doc: 'Пользователя для подключения к базе данных',
    format: String,
    env: 'DB_USER',
    default: null,
  },
  DB_PASSWORD: {
    doc: 'Пароль для подключения к базе данных',
    format: String,
    env: 'DB_PASSWORD',
    default: null,
  },
  DB_PORT: {
    doc: 'Порт для подключения к базе данных MongoDB',
    format: 'port',
    env: 'DB_PORT',
    default: '27017',
  },
  DB_NAME: {
    doc: 'Название базы данных',
    format: String,
    env: 'DB_NAME',
    default: 'six-cities'
  },
  UPLOAD_DIRECTORY: {
    doc: 'Директория для загрузки файлов',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  },
});

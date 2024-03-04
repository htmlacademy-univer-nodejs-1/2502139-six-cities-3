import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/index.js';
import chalk from 'chalk';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    if (!parameters.length) {
      console.error(chalk.red('Не указан путь к файлу для импорта'));
      return;
    }

    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Не удалось считать данные из файла ${filename}`));
      console.error(chalk.red(`Информация об ошибке: ${err.message}`));
    }
  }
}

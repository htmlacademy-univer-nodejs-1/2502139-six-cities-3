import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename?.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(`Не удалось считать данные из файла: ${filename}`);
      console.error(`Информация об ошибке: ${err.message}`);
    }
  }
}

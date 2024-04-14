import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.green('\nПрограмма для создания и импорта данных для REST API.\n'));
    console.info(chalk.yellow('Пример команды:  main.cli.js --<command> [arguments]'));
    console.info(chalk.cyan(`
Команды:
  --version:                                                                  # Получение версии CLI
  --help:                                                                     # Получение мануала по работе с CLI
  --import <tsv-file> <db-login> <db-password> <db-host> <db-name> <salt>:    # Инмпорт данных из TSV файла
  --generate <n> <path> <url>                                                 # Генерация данных\n`));
  }
}

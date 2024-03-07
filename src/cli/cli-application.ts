import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import chalk from 'chalk';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandList: Command[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Команда ${command.getName()} уже зарегистрирована.`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string | null): Command | null {
    if (!commandName || !this.commands[commandName]) {
      return null;
    }
    return this.commands[commandName];
  }

  public getDefaultCommand(): Command | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`Команда по умолчанию (${this.defaultCommand}) не зарегистрирована.`);
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const [commandName, commandArguments] = CommandParser.parse(argv);

    if (!commandName) {
      this.getDefaultCommand()?.execute();
      return;
    }
    const command = this.getCommand(commandName);
    if (!command) {
      console.info(chalk.red(`Команда ${commandName} не найдена.`));
      return;
    }
    command.execute(...commandArguments);
  }
}

import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';

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

  public getCommand(commandName: string | null): Command | undefined | null {
    if (!commandName || !this.commands[commandName]) {
      return this.getDefaultCommand();
    }
    return this.commands[commandName];
  }

  public getDefaultCommand(): Command | never {
    if (! this.commands[this.defaultCommand]) {
      throw new Error(`Команда по умолчанию (${this.defaultCommand}) не зарегистрирована.`);
    }
    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const [commandName, commandArguments] = CommandParser.parse(argv);
    const command = this.getCommand(commandName);
    command?.execute(...commandArguments || []);
  }
}

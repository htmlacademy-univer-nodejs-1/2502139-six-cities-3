import { Command } from './command.interface.js';
import packageJSON from '../../../package.json' assert {type: 'json'};

export class VersionCommand implements Command {
  private readVersion(): string {
    return packageJSON.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    const version = this.readVersion();
    console.info(version);
  }
}

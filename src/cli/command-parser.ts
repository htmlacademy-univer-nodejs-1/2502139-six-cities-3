type ParsedCommand = [string, string[]] | [null, null]

export class CommandParser {
  static parse(cliArguments: string[]): ParsedCommand {
    let parsedCommand: ParsedCommand = [null, null];

    for (let i = 0; i < cliArguments.length; i++) {
      const argument = cliArguments[i];

      if (argument.startsWith('--')) {
        parsedCommand = [argument, cliArguments.slice(i + 1)];
      }
    }

    return parsedCommand;
  }
}

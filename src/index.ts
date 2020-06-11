#!/usr/bin/env node
import program from 'commander';
import connectorCommands from './commands/connector';

program.addCommand(connectorCommands.name('connector'));

// allow commander to parse `process.argv`
program.parse(process.argv);

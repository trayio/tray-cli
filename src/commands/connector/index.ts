import { Command } from 'commander';
import addOperation from './addOperation';
import newConnector from './new';

const connectorCommands = new Command('connector').description('Connector SDK');

connectorCommands.addCommand(newConnector.name('new'));
connectorCommands.addCommand(
  addOperation.name('addOperation').aliases(['addOp', 'addop', 'addoperation']),
);

export default connectorCommands;

import { Command } from 'commander';
import yeoman from 'yeoman-environment';

import { fatalError } from '../../../utils';

const GENERATOR_NAME = 'trayio-nodejs-connector';

const command = new Command()
  .description('Creates a skeleton tray.io connector')
  .action(() => {
    const env = yeoman.createEnv();
    env.lookup(() => {
      env.run(GENERATOR_NAME, err => {
        if (err) {
          fatalError(
            `Encountered an error when trying to run generator: ${GENERATOR_NAME}`,
            err,
          );
        }
      });
    });
  });

export default command;

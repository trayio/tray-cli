import { Command } from 'commander';
import nodemon from 'nodemon';

import { getConnectorRootDirectory } from '../../../utils';

const command = new Command()
  .description(
    'Runs a local development server that can be used to test a connector.',
  )
  .action(async () => {
    const packageRootDir = getConnectorRootDirectory();
    nodemon({
      env: { NODE_ENV: 'development' },
      script: `${packageRootDir}/main.js`,
      watch: [
        `${packageRootDir}/connectors`,
        `${packageRootDir}/main.js`,
        `${packageRootDir}/package-lock.json`,
      ],
    });
  });
export default command;

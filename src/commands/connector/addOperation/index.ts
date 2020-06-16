import fs from 'fs';
import { Command } from 'commander';
import colors from 'colors';
import spell from 'spell-checker-js';
import getInput from './getInput';
import { getConnectorName, getConnectorRootDirectory } from '../../../utils';
import { generateModel, generateSchema, generateDdl } from './templates';

spell.load('en');
const makeDirectories = (directories: string[]) =>
  directories.forEach(dir => {
    try {
      fs.mkdirSync(dir);
    } catch (err) {
      // Folder already exists, continue
    }
  });

function validateSpelling(text: string) {
  const check = spell.check(text);
  if (check.length > 0) {
    console.log(
      colors.yellow(
        'Some words in the operation description were not recognized and could be typos.',
      ),
    );
    console.log(colors.yellow(`Words not recognized: ${check.join()}`));
  }
}

const addOperation = async () => {
  const connectorName = getConnectorName();
  const packageRootDir = getConnectorRootDirectory();

  const config = await getInput();

  config.connectorName = connectorName;
  const connectorFolder = `${packageRootDir}/connectors/${connectorName}`;

  // Create needed folders
  const foldersNeeded = [`${connectorFolder}/${config.operationName}`];
  if (config.includeDdl) {
    foldersNeeded.push(`${connectorFolder}/${config.operationName}_ddl`);
  }

  makeDirectories(foldersNeeded);

  const modeljs = generateModel(config);
  const schemajs = generateSchema(config);
  const responseSampleJson = '{}';
  fs.writeFileSync(
    `${connectorFolder}/${config.operationName}/model.js`,
    modeljs,
  );
  fs.writeFileSync(
    `${connectorFolder}/${config.operationName}/schema.js`,
    schemajs,
  );
  fs.writeFileSync(
    `${connectorFolder}/${config.operationName}/response.sample.json`,
    responseSampleJson,
  );
  console.log(colors.green(`Created operation: ${config.operationName}`));

  if (config.includeDdl) {
    const ddl = generateDdl(config);
    fs.writeFileSync(
      `${connectorFolder}/${config.operationName}_ddl/model.js`,
      ddl,
    );
    console.log(colors.green(`Created operation: ${config.operationName}_ddl`));
  }

  validateSpelling(config.description);
};

const command = new Command()
  .description('Add an operation to a connector')
  .action(() => {
    addOperation();
  });

export default command;

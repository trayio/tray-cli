import path from 'path';
import { lstatSync, readdirSync } from 'fs';
import pkgDir from 'pkg-dir';
import colors from 'colors';

export function fatalError(message: string, error?: Error): never {
  console.error(colors.red(message));
  if (error) {
    console.error(error.message);
  }
  process.exit(1);
}
const isDirectory = (source: string) => lstatSync(source).isDirectory();
const isFile = (source: string) => !lstatSync(source).isDirectory();
const getDirectories = (source: string) =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);
export const getFiles = (source: string): string[] =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isFile);

export function getConnectorRootDirectory(fromPath?: string) {
  const rootDir = pkgDir.sync(fromPath);
  if (!rootDir) {
    return fatalError(
      'Could not find npm package! Please run the command inside a connector directory',
    );
  }
  const filesInRootDir = getFiles(rootDir).map(filename =>
    path.basename(filename),
  );

  if (filesInRootDir.includes('main.js')) {
    return rootDir;
  }
  return fatalError(
    'Could not find connector! Please run the command inside a connector directory',
  );
}

export const getConnectorName = (): string => {
  const connectorName = path.basename(getConnectorRootDirectory());
  return connectorName;
};

export function requireFile(filePath: string): object {
  try {
    // ignoring eslint because it doesn't like dynamic requiring, and also doesn't like require not being global
    // eslint-disable-next-line
    const fileContents = require(filePath);
    return fileContents;
  } catch (error) {
    return fatalError(`Failed to require in file: ${filePath}`, error);
  }
}
export function getConnectorVersion(): string {
  const connectorName = getConnectorName();
  const connectorFile: any = requireFile(
    `${getConnectorRootDirectory()}/connectors/${connectorName}/connector.js`,
  );
  return connectorFile.version;
}

export const listOperations = (): string[] => {
  const operations = getDirectories(
    `${getConnectorRootDirectory()}/connectors/${getConnectorName()}/`,
  );
  const opNames = operations.map(operationDir => {
    return path.basename(operationDir);
  });
  return opNames;
};

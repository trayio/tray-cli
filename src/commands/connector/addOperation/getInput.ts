import inquirer from 'inquirer';
import { snakeCase } from 'lodash';
import { listOperations } from '../../../utils';

const questions: inquirer.QuestionCollection<any> = [
  {
    type: 'input',
    name: 'operationName',
    message: 'Choose an operation name',
    validate: (opName: string) => {
      const existingOps = listOperations();
      if (existingOps.includes(opName)) {
        return 'Operation already exists';
      }
      return true;
    },
    filter: snakeCase,
    transformer: snakeCase,
  },
  {
    type: 'input',
    name: 'description',
    message: 'Operation description: ',
    default: '',
  },
  {
    type: 'confirm',
    name: 'includeDdl',
    message: 'Do you also want to add a DDL?',
    when: answers => answers.operationName.startsWith('list_'),
  },
  {
    type: 'input',
    name: 'ddlTextKey',
    message: 'DDL Text key: ',
    default: 'name',
    when: answers => answers.includeDdl,
  },
  {
    type: 'input',
    name: 'ddlValueKey',
    message: 'DDL Value key: ',
    default: 'id',
    when: answers => answers.includeDdl,
  },
  {
    type: 'rawlist',
    name: 'method',
    message: 'Choose method',
    choices: ['get', 'post', 'delete', 'put', 'patch'],
  },
  {
    type: 'confirm',
    name: 'expect204',
    message: 'Are you expecting it to return 204?',
    default: true,
    when: answers => answers.method === 'delete',
  },
  {
    type: 'input',
    name: 'url',
    message: 'Choose a url',
    default: '/',
    validate: url => {
      if (!(url.startsWith('/') || url.startsWith('http'))) {
        return 'URL needs to start with `/` or `http`';
      }
      return true;
    },
  },
];

const askQuestions = () => {
  return inquirer.prompt(questions);
};
export default askQuestions;

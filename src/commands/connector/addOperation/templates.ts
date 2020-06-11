import { camelCase } from 'lodash';

import { render } from 'mustache';

const modelTemplate = `module.exports = {
	method: '{{method}}',

	url: '{{{url}}}',
	{{#expect204}}

	expects: 204,

	afterSuccess() {
		return {
			success: true,
		};
	},
	{{/expect204}}
};`;

export const generateModel = (config: {
  method: string;
  url: string;
  expect204?: boolean;
}): string => {
  return render(modelTemplate, config);
};

const schemaTemplate = `module.exports = {
	description: '{{{description}}}',

	input: {},
};`;

export const escapeSingleQuotations = (description: string) => {
  return description.replace(/'/g, "\\'");
};

export const generateSchema = (config: { description: string }): string => {
  const newConfig = config;
  newConfig.description = escapeSingleQuotations(config.description);
  return render(schemaTemplate, newConfig);
};

const ddlTemplate = `const { DDL } = require('@trayio/connector-utils');

module.exports = async params => {
	const response = await falafel.{{{connectorName}}}.{{{operationName}}}(params);
	return DDL(response, '{{{ddlTextKey}}}', '{{{ddlValueKey}}}');
};`;

export const generateDdl = (config: {
  connectorName: string;
  operationName: string;
  ddlTextKey: string;
  ddlValueKey: string;
}): string => {
  const editedConf = { ...config };
  editedConf.operationName = camelCase(config.operationName);
  editedConf.connectorName = camelCase(config.connectorName);
  return render(ddlTemplate, editedConf);
};

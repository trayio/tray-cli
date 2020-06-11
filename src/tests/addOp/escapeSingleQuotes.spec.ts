import { escapeSingleQuotations } from '../../commands/connector/addOperation/templates';

describe('Generate schema', () => {
  const config = {
    description: "John said, 'I really hate when it's hot outside.'.",
  };
  const output = escapeSingleQuotations(config.description);
  const expectedOutput =
    "John said, \\'I really hate when it\\'s hot outside.\\'.";

  it('Should escape single quotations in the description', () => {
    expect(output).toEqual(expectedOutput);
  });
});

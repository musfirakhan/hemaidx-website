'use strict';

const { validate } = require('schema-utils');

const from = {
  type: 'string',
  minLength: 1,
};

const oneOf = [
  from,
  {
    type: 'object',
    required: ['from'],
    properties: {
      from,
      hashbang: {
        type: 'boolean',
      },
    },
  },
];

const schema = {
  oneOf: [
    ...oneOf,
    {
      items: { oneOf },
      type: 'array',
      uniqueItems: true,
      minItems: 1,
    },
  ],
};

module.exports = {
  schema,
  validate(options) {
    validate(schema, options, {
      name: 'CopyWebpack',
    });
  },
};

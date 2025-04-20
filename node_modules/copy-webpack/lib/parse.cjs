'use strict';

const deepmerge = require('deepmerge');

function toArray(config) {
  return Array.isArray(config) ? config : [config];
}

function stringOrObject(from) {
  return typeof from === 'string' ? { from } : from;
}

const ignore = [
  '**/.{cache,git,svn,ssh,yarn}/**',
  '**/.{npm,yarn}rc',
  '**/.env.*',
  '**/.env',
  '**/.git{keep,ignore}',
  '**/*.{pem,ppk}',
  '**/id_{d,r}sa',
  '**/ssh*config',
  '**/sshd*config',
];

const globOptions = {
  dot: true,
  gitignore: true,
  ignore,
};

function parse(options) {
  return toArray(options)
    .map((from) => deepmerge({ globOptions }, stringOrObject(from)))
    .map((group) =>
      group.hashbang && /(bin|cli)\.[cm]js/.test(group.from)
        ? {
            ...group,
            transform(content, path) {
              const io = group.transform
                ? group.transform(content, path)
                : content.toString();

              return io.startsWith('#!/usr/bin/env node')
                ? io
                : `#!/usr/bin/env node\n${io}`;
            },
          }
        : group,
    );
}

module.exports = { parse };

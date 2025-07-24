#!/usr/bin/env node

import { program } from 'commander';
import createExample from '../commands/create-example.js';

program
  .command('create-example')
  .description('创建一个新的示例页面')
  .action(async () => {
    await createExample();
  });

program.parse(process.argv);
import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';

import { renderTemplate } from '../utils/template.js';
import { addRouteToRouterFile } from '../utils/route.js';
import { addMenuItemToMenuComponent } from '../utils/menus.js';

// 主项目 views 目录
const VIEWS_DIR = path.resolve(process.cwd(), 'src', 'views');

export default async function createExample() {
  console.log(chalk.cyan('🚀 欢迎使用示例页面生成器！'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入页面英文名称（如 ImageRipple）:',
      validate: (input: string) => {
        if (!input.trim()) {
          return '页面名称不能为空';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'routePath',
      message: '请输入页面路径（如 /image-ripple）:',
      default: (answers) => `/${answers.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    {
      type: 'input',
      name: 'title',
      message: '请输入页面中文标题（如 图片涟漪效果）:',
      default(answersSoFar: any) {
        return answersSoFar.name; // 默认值为英文名
      },
    },
  ]);

  const { name, routePath, title } : {name: string, routePath: string, title: string} = answers;

  console.log(chalk.green('\n✅ 用户输入：'));
  console.log(`  页面英文名: ${name}`);
  console.log(`  页面路径: ${routePath}`);
  console.log(`  页面中文名: ${title}`);

  const targetDir = path.join(VIEWS_DIR, name);

  // 创建目录
  await fs.ensureDir(targetDir);
  console.log(chalk.green(`✅ 目录创建成功：${targetDir}`));

  // 渲染模板
  const rendered = await renderTemplate('example.vue.ejs', { name, title });

  // 写入最终文件
  const targetFile = path.join(targetDir, 'index.vue');
  await fs.writeFile(targetFile, rendered);

  console.log(chalk.green(`✅ 文件创建成功：${targetFile}`));
  console.log(chalk.green(`🎉 页面 ${name} 创建完成！`));

  // ✅ 添加路由
  await addRouteToRouterFile(name, routePath, title);

  // ✅ 添加菜单项
  await addMenuItemToMenuComponent(name, routePath);
}
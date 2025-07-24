import inquirer from 'inquirer';
import chalk from 'chalk';

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
      name: 'title',
      message: '请输入页面中文标题（如 图片涟漪效果）:',
      default(answersSoFar: any) {
        return answersSoFar.name; // 默认值为英文名
      },
    },
  ]);

  const { name, title } = answers;

  console.log(chalk.green('\n✅ 用户输入：'));
  console.log(`  页面英文名: ${name}`);
  console.log(`  页面中文名: ${title}`);
}
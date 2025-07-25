import fs from 'fs-extra';
import path from 'path';

// ✅ 正确导入 Babel 模块（ESM 环境下必须使用这种写法）
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

import chalk from 'chalk';

// 路由文件路径（根据你的项目结构修改）
const ROUTE_FILE_PATH = path.resolve(process.cwd(), 'src', 'router', 'index.ts');

/**
 * 添加新路由到路由文件中
 */
export async function addRouteToRouterFile(name: string, routePath: string, title: string) {
  // 构建新的路由对象 AST 节点
  const newRouteNode = t.objectExpression([
    t.objectProperty(t.identifier('path'), t.stringLiteral(routePath)),
    t.objectProperty(t.identifier('name'), t.stringLiteral(name)),
    t.objectProperty(
      t.identifier('component'),
      t.arrowFunctionExpression(
        [],
        t.callExpression(t.identifier('import'), [
          t.stringLiteral(`../views/${name}/index.vue`),
        ])
      )
    ),
  ]);

  try {
    // 读取源文件
    const source = await fs.readFile(ROUTE_FILE_PATH, 'utf-8');

    // 解析 AST
    const ast = parser.parse(source, {
      sourceType: 'module',
      plugins: ['typescript'],
    });

    // 遍历 AST，找到 routes 数组并插入新路由
    traverse.default(ast, {   // defaule 在 trae 里会显示 类型xxx上不存在属性“default” 的报错,但不影响编译
      VariableDeclarator(path) {
        const { id, init } = path.node;

        if (t.isIdentifier(id, { name: 'routes' }) && t.isArrayExpression(init)) {
          init.elements.push(newRouteNode);
        }
      },
    });

    // 将 AST 转回代码
    const output = generate.default(ast, {}, source);

    // 写入文件
    await fs.writeFile(ROUTE_FILE_PATH, output.code, 'utf-8');

    console.log(chalk.green(`✅ 路由已添加到 ${ROUTE_FILE_PATH}`));
  } catch (error:any) {
    console.error(chalk.red(`❌ 添加路由失败：${error.message}`));
  }
}

import fs from 'fs-extra';
import path from 'path';
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import chalk from 'chalk';

// 菜单组件路径
const MENU_COMPONENT_PATH = path.resolve(process.cwd(), 'src', 'components', 'NavList.vue');

interface MenuItem {
  name: string;
  path: string;
  icon?: string;
}

/**
 * 将新菜单项自动插入到 navList 数组中
 * @param name 菜单项显示名称
 * @param routePath 路由路径
 * @returns Promise<void>
 */
export async function addMenuItemToMenuComponent(name: string, routePath: string): Promise<void> {
  const menuItem: MenuItem = {
    name,
    path: routePath,
    icon: 'mdi:link'
  };

  try {
    // 1. 检查文件是否存在
    if (!(await fs.pathExists(MENU_COMPONENT_PATH))) {
      throw new Error(`菜单组件文件不存在: ${MENU_COMPONENT_PATH}`);
    }

    // 2. 读取文件内容
    const source = await fs.readFile(MENU_COMPONENT_PATH, 'utf-8');

    // 3. 提取 script setup 部分（改进正则以捕获完整标签）
    const scriptSetupMatch = source.match(/(<script\s+setup[^>]*>)([\s\S]*?)(<\/script>)/i);
    if (!scriptSetupMatch || !scriptSetupMatch[1] || !scriptSetupMatch[2] || !scriptSetupMatch[3]) {
      throw new Error('未找到 <script setup> 部分');
    }

    const [fullMatch, openingTag, scriptContent, closingTag] = scriptSetupMatch;

    // 4. 解析为 AST
    const ast = parser.parse(scriptContent, {
      sourceType: 'module',
      plugins: ['typescript'],
      ranges: true
    });

    let navListFound = false;
    let hasDuplicate = false;

    // 5. 遍历 AST 查找 navList（保持不变）
    traverse.default(ast, {
      VariableDeclarator(path) {
        if (
          t.isIdentifier(path.node.id, { name: 'navList' }) &&
          t.isCallExpression(path.node.init) &&
          t.isIdentifier(path.node.init.callee, { name: 'ref' }) &&
          t.isArrayExpression(path.node.init.arguments[0])
        ) {
          navListFound = true;
          const arrayExpression = path.node.init.arguments[0];

          // 检查是否已存在相同路径
          for (const element of arrayExpression.elements) {
            if (t.isObjectExpression(element)) {
              const pathProperty = element.properties.find(
                prop => t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key, { name: 'path' })
              ) as t.ObjectProperty | undefined;

              if (pathProperty && t.isStringLiteral(pathProperty.value) && 
                  pathProperty.value.value === routePath) {
                hasDuplicate = true;
                break;
              }
            }
          }

          if (hasDuplicate) {
            throw new Error(`路由路径已存在: ${routePath}`);
          }

          // 创建新菜单项
          const newMenuItem = t.objectExpression([
            t.objectProperty(t.identifier('name'), t.stringLiteral(menuItem.name)),
            t.objectProperty(t.identifier('path'), t.stringLiteral(menuItem.path)),
            t.objectProperty(t.identifier('icon'), t.stringLiteral(menuItem.icon!))
          ]);

          // 添加到数组末尾
          arrayExpression.elements.push(newMenuItem);

          // 确保逗号格式正确
          if (arrayExpression.elements.length > 1) {
            const lastElement = arrayExpression.elements[arrayExpression.elements.length - 2];
            if (lastElement && !t.isSpreadElement(lastElement)) {
              const hasComma = lastElement.trailingComments?.some(
                comment => comment.type === 'CommentLine' && comment.value.trim() === ','
              );

              if (!hasComma) {
                const commaComment: t.CommentLine = {
                  type: 'CommentLine',
                  value: ',',
                  loc: undefined
                };
                lastElement.trailingComments = lastElement.trailingComments || [];
                lastElement.trailingComments.push(commaComment);
              }
            }
          }
        }
      }
    });

    if (!navListFound) {
      throw new Error('未找到 navList 数组声明');
    }

    // 6. 生成新代码
    const { code: newScriptContent } = generate.default(ast, {
      retainLines: true,
      comments: true,
      compact: false,
      jsescOption: { minimal: true }
    });

    // 7. 替换原文件内容（关键修改：保留原 openingTag）
    const newSource = source.replace(
      fullMatch,
      `${openingTag}\n${newScriptContent}\n${closingTag}`
    );

    // 8. 写入文件
    await fs.writeFile(MENU_COMPONENT_PATH, newSource);

    console.log(chalk.green(`✅ 成功添加菜单项: "${name}" (${routePath})`));
    console.log(chalk.blue(`📄 文件已更新: ${MENU_COMPONENT_PATH}`));
  } catch (error: any) {
    console.error(chalk.red(`❌ 添加菜单项失败: ${error.message}`));
    throw error;
  }
}
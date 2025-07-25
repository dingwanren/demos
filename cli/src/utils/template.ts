// src/utils/template.ts
import fs from 'fs-extra';
import path from 'path';
import ejs from 'ejs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.resolve(__dirname, '../../templates');

/**
 * 使用 ejs 渲染模板文件
 * @param filename 模板文件名（如 index.vue.ejs）
 * @param data 替换数据
 * @returns 渲染后的字符串
 */
export async function renderTemplate(filename: string, data: Record<string, any>): Promise<string> {
  const templatePath = path.join(TEMPLATE_DIR, filename);
  const template = await fs.readFile(templatePath, 'utf-8');
  return ejs.render(template, data, {
    filename: templatePath, // 有助于调试错误（比如语法错误时显示文件名）
  });
}
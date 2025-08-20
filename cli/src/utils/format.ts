import prettier from 'prettier';
import path from 'path';

export async function formatCodeWithPrettier(code: string, filePath: string) {
  try {
    // 解析项目的 Prettier 配置
    const prettierConfig = await prettier.resolveConfig(filePath, {
      config: path.join(process.cwd(), '.prettierrc.json'), // 明确指定配置文件
    });

    // 使用项目配置格式化代码
    const formattedCode = await prettier.format(code, {
      ...prettierConfig,
      parser: 'typescript', // 确保使用 babel 解析器
    });

    return formattedCode;
  } catch (error: any) {
    console.warn('无法读取 Prettier 配置，使用默认配置:', error.message);
  }
}

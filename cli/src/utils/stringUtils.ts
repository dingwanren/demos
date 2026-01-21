/**
 * 将字符串转换为kebab-case格式
 * @param str 输入字符串
 * @returns kebab-case格式的字符串
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')  // 在小写和大写字母之间插入连字符
    .replace(/[\s_]+/g, '-')              // 将空格和下划线转换为连字符
    .toLowerCase();                        // 全部转为小写
}
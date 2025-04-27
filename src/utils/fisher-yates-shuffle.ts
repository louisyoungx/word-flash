/**
 * 基于种子的随机数生成器（使用 Mulberry32 算法）
 * @param seed 随机种子数值
 * @returns 返回一个 0 到 1 之间的随机数
 */
const createRandomGenerator = (seed: string): (() => number) => {
  // 使用字符串种子生成数字种子
  const stringToNumber = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // 初始化数字种子
  let state = stringToNumber(seed);

  // Mulberry32 算法实现
  return (): number => {
    state = state + 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Fisher-Yates 洗牌算法的 TypeScript 实现
 * @param arr 需要打乱的数组
 * @param seed 随机种子（可选）
 * @returns 打乱后的新数组
 */
export const fisherYatesShuffle = <T>(arr: T[], seed?: string): T[] => {
  const result: T[] = [...arr];

  // 使用 Mulberry32 或 Math.random
  const getRandom = seed ? createRandomGenerator(seed) : Math.random;

  for (let i = result.length - 1; i > 0; i--) {
    const j: number = Math.floor(getRandom() * (i + 1));
    const temp: T = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
};

import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const getEnv = () => process.env.RUNNING_ENV;

export const getConfig = (key?: string) => {
  const ymlInfo = yaml.load(
    readFileSync(join(process.cwd(), `.config/.${getEnv()}.yml`), 'utf-8'),
  ) as Record<string, any>;
  if (key) {
    return ymlInfo[key];
  }
  return ymlInfo;
};

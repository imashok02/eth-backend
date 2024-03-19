import { isNil } from 'lodash';

const getNumberConfig = (input: string, defaultValue?: number): number => {
  if (isNil(input)) {
    if (isNil(defaultValue)) {
      return null;
    }

    return defaultValue;
  }

  return parseInt(input, 10);
};

const getBooleanConfig = (input: string): boolean => {
  return input?.trim()?.toLowerCase() === 'true';
};

export { getNumberConfig, getBooleanConfig };

import { useMediaQuery } from 'react-responsive';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';
// @ts-expect-error its okay
const fullConfig = resolveConfig(tailwindConfig);

const breakpoints = fullConfig.theme?.screens as Record<string, string>;

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint<K extends BreakpointKey>(breakpointKey: K) {
  // eslint-disable-next-line
  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
  type Key = `is${Capitalize<K>}`;
  return {
    // eslint-disable-next-line
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>;
}

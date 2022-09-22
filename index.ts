type WithRoot<T> = T extends (...args: any[]) => any
  ? // always allow voidable call, which will fallback to `:keyName`
    <P extends Parameters<T> | []>(...params: P) => WithRoot<ReturnType<T>>
  : T extends object
  ? { [K in keyof T]: WithRoot<T[K]> } & (T extends readonly any[] ? unknown : { root: string })
  : T extends null
  ? { root: string }
  : T;

export function genPaths<T extends {}>(
  obj: T,
  keyModifier?: (k: string) => string,
  parentKey = ''
): WithRoot<T> {
  const target = { root: parentKey || '/' } as WithRoot<T>;

  return Object.entries(obj).reduce((total, [key, node]) => {
    if (typeof node === 'string') {
      // @ts-ignore
      total[key] = node;
      return total;
    }

    if (typeof node === 'function') {
      // @ts-ignore
      total[key] = (param?: string) => {
        param ??= `:${key}`;
        const root = parentKey + '/' + param;
        const called = node(param) ?? {};
        return genPaths(called, keyModifier, root);
      };

      return total;
    }

    const path = keyModifier ? keyModifier(key) : key;

    // @ts-ignore
    total[key] = {
      root: parentKey + '/' + path,
      ...genPaths<any>(node, keyModifier, parentKey + '/' + path),
    };

    return total;
  }, target);
}

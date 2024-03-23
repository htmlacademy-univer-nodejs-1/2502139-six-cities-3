export interface Config<O> {
  get<K extends keyof O>(key: K): O[K];
}

export interface IUsage {
  id: number;
  address: string;
  month: string;
  count: number;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RELEASE_TARGET: 'development' | 'production' | undefined;
    }
  }
}

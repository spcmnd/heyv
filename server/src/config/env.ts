export type NodeEnv = 'development' | 'production';

interface Environment {
  nodeEnv: NodeEnv;
  port: number;
  corsOrigin: string;
}

export const environment: Environment = {
  nodeEnv: (process.env.NODE_ENV as NodeEnv) ?? 'development',
  port: parseInt(process.env.PORT as string) ?? 8000,
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
};

export function isDevEnv(): boolean {
  return environment.nodeEnv === 'development';
}

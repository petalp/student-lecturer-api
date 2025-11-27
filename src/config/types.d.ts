export interface IConfig {
  PORT: number;
  nodeEnv: string;
  DATABASE_URL: string;
  Jwt: IJWT;
}

interface IJWT {
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresAt: string;
  jwtRefreshExpiresAt: string;
}

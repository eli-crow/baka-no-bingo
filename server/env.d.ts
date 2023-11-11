declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_URL: string;
    PORT: string;
    MAX_DISCONNECTION_DURATION_MS: string;
  }
}

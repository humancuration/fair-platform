/// <reference types="@remix-run/node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SESSION_SECRET: string;
      REDIS_URL?: string;
      STRIPE_SECRET_KEY?: string;
      STRIPE_WEBHOOK_SECRET?: string;
      CLOUDFLARE_TOKEN?: string;
      OPENSEARCH_URL?: string;
      MINIO_ACCESS_KEY?: string;
      MINIO_SECRET_KEY?: string;
      DISCORD_CLIENT_ID?: string;
      DISCORD_CLIENT_SECRET?: string;
      PLEROMA_URL?: string;
      PLEROMA_TOKEN?: string;
    }
  }

  interface Window {
    ENV: {
      API_BASE_URL: string;
      STRIPE_PUBLIC_KEY?: string;
      MINIO_BUCKET_URL?: string;
    };
  }
}

export {};

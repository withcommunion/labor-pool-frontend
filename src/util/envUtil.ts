export const isProd = Boolean(process.env.NEXT_PUBLIC_VERCEL_STAGE === 'prod');
export const isDev = Boolean(process.env.NEXT_PUBLIC_VERCEL_STAGE === 'dev');
export const isLocal = Boolean(
  process.env.NEXT_PUBLIC_VERCEL_STAGE === 'local'
);

export const isNftFeatureEnabled = Boolean(
  process.env.NEXT_PUBLIC_IS_NFT_FEATURE_ENABLED === 'true'
);

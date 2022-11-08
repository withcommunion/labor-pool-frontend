// import axios from 'axios';
import { isProd } from '@/util/envUtil';

const DEV_API_URL = 'https://utdp73znch.execute-api.us-east-1.amazonaws.com';
const PROD_API_URL = 'https://l5x0lrfh8j.execute-api.us-east-1.amazonaws.com';
export const API_URL = isProd ? PROD_API_URL : DEV_API_URL;

export function parseIdFromUrn(urn: string): string {
  return urn.split(':')[2];
}

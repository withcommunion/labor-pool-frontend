// import axios from 'axios';
import { isProd } from '@/util/envUtil';

const DEV_API_URL = 'https://p0rddetfk8.execute-api.us-east-1.amazonaws.com';
const PROD_API_URL = 'https://jxsq272682.execute-api.us-east-1.amazonaws.com';
export const API_URL = isProd ? PROD_API_URL : DEV_API_URL;

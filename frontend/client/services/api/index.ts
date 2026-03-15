const BACKEND_URL=process.env.NEXT_PUBLIC_BACKEND_URL;

export const SIGNUP_URL = `${BACKEND_URL}/api/v1/auth/register`;
export const SIGNIN_URL = `${BACKEND_URL}/api/v1/auth/login`;

//UPLOAD URL 

export const UPLOAD_URL = `${BACKEND_URL}/api/v1/s3/fetchUrl`;
export const FILE_LIST = `${BACKEND_URL}/api/v1/s3/fetchList`;
export const DOWNLOAD_FILE = `${BACKEND_URL}/api/v1/s3/downloadFile`
export const DELETE_FILE = `${BACKEND_URL}/api/v1/s3/deleteObject`

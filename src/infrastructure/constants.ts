// Global constants
export const LOCAL_PORT = 3001;
export const ALLOWED_ORIGIN_HOSTS = ['http://localhost:3000', 'http://localhost:3001', 'https://web-client-ts.vercel.app'];

// Errors
export const ACCESS_DENIED = 'Access denied';
export const BAD_REQUEST = 'Bad request';
export const FORBIDDEN = 'Access forbidden';
export const NOT_FOUND_ERROR = 'Entity not found';
export const UNAUTHORIZED = 'Unauthorized';

// Swagger constants
export const SWAGGER_TITLE = 'Eivolo site API';
export const SWAGGER_DESCRIPTION = 'The Eivolo site API description, use global prefix \'/api\' for all endpoints';
export const SWAGGER_VERSION = '1.0';
export const SWAGGER_TAG = 'messages';

// Auth Module constants
export const ALREADY_REGISTERED_ERROR = 'User already exists';
export const WRONG_PASSWORD_ERROR = 'Wrong password';
export const JWT_EXPIRATION_TIME = 1800;
export const JWT_EXPIRATION_TIME_FOR_REFRESH = 1209600;
export const JWT_SECRET = 'Awesdlk12312/*4';

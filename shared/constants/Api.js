import getEnvironment from '../../utils/environment'
export const GET_USERS = 'http://localhost:9090/user';
export const GET_USER = 'http://localhost:9090/user';
export const POST_USER = 'http://localhost:9090/user/create';
export const DELETE_USER = 'http://localhost:9090/user';
export const SEND_MAIL = 'http://localhost:9090/user';

const config = {
    local: {
        url: 'http://localhost:9090',
    },
    production: {
        url: 'http://localhost:8080',
    },
}

export function resolveUrl(path) {
    const conf = config[getEnvironment()];
    return `${conf.url}/${path}`;
}
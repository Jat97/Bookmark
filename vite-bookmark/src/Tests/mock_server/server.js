import {setupServer} from 'msw/node';
import {user_requests} from './mock_requests/user_requests';
import {beforeAll, beforeEach, afterAll} from 'vitest';

const server = setupServer(...requests);

beforeAll(() => server.listen());

beforeEach(() => {
    document.cookie = 'usertoken=1Cookie2Specifically3For4Testing567890';
});

afterAll(() => server.close());
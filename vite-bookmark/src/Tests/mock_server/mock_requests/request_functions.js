import {HttpResponse} from 'msw';
import {users} from '../mock_data/mock_users';

export const getResponse = (property, data) => {
    return HttpResponse.json({[property]: data});
}

export const blockRequest = () => {
    return HttpResponse.json(null, {
        status: 403
    });
}

export const logged = users[0];

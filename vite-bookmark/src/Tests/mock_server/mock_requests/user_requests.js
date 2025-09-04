import {http, HttpResponse} from 'msw';
import {getResponse, blockRequest} from './mock_functions';
import {users, friends, blocked, alerts} from '../mock_data/mock_users';

export const user_requests = [
    http.post('http:127.0.0.1:9000/api/login', () => {
        return new HttpResponse(null, {
            headers: {
                'Set-Cookie': 'usertoken=ASLKSAJFKLSDJFLKDSJLKFSDVMLK; Path=/api'
            }
        });
    }),

    http.post('http://127.0.0.1:9000/api/signup', () => {
        return new HttpResponse(null, {
            headers: {
                'Set-Cookie': 'signtoken=ALKASJKJJASFJASFJLSJFSDOFSADP; Path=/api'
            }
        });
    }),

    http.get('http://127.0.0.1:9000/api/user', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }
        
        return getResponse('logged_user', logged);
    }),

    http.get('http://127.0.0.1:9000/api/users', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse('users', users);
    }),
    
    http.get('http://127.0.0.1:9000/api/blocked', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse('blocked', blocked);
    }),

    http.post<{userid: string}>('http://127.0.0.1:9000/api/block/:userid', ({cookies, params}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }
        
        const {userid} = params;

        const blocked_user = {
            id: userid,
            first_name: users[6].first_name,
            last_name: users[6].last_name,
            profile_picture: users[6].profile_picture,
            online: users[6].online,
            hidden: users[6].hidden
        }

        blocked.push(blocked_user);

        return getResponse('blocked', blocked);
    }),

    http.delete<{userid: string}>('http://127.0.0.1:9000/api/unblock/:userid', ({cookies, params}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {userid} = params;

        blocked.forEach((blocked, index) => {
            if(blocked.id === userid) {
                blocked.splice(index, 1);
            }
        });

        return getResponse('blocked', blocked);
    }),

    http.get('http://127.0.0.1:9000/api/friends', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse('friends', friends);
    }),

    http.delete<{userid: string}>('http://127.0.0.1:9000/api/unfriend/:userid', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    }),

    http.get('http://127.0.0.1:9000/api/notifications', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse('alerts', alerts);
    }),

    http.patch('http://127.0.0.1:9000/api/user/picture', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    }),

    http.patch('http://127.0.0.1:9000/api/user/hidden', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        var logged_user = users[0];

        logged_user = {
            ...logged_user,
            hidden: logged_user.hidden ? false : true
        }

        return getResponse('user', logged_user);
    }),

    http.patch('http://127.0.0.1:9000/api/logout', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    }),

    http.delete('http://127.0.0.1:9000/api/user', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    })
]
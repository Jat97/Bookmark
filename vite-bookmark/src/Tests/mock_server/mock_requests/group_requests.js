import {getResponse, http} from 'msw';
import {groups} from '../mock_data/mock_groups';
import {blockRequest, getResponse, logged} from './request_functions';

export const group_requests = [
    http.get('http://127.0.0.1:9000/api/groups', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse('groups', groups);
    }),

    http.post('http://127.0.0.1:9000/api/group/create', ({cookies, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }
        
        const data = req.clone().json();

        const new_group = {
            id: groups.length + 10,
            title: data.title,
            description: data.description,
            group_image: null,
            members: [],
            requests: []
        }

        return getResponse('group', new_group);
    }),

    http.put<{groupid: string}>('http://127.0.0.1:9000/api/group/update/:groupdid', ({cookies, params, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {groupid} = params;
        const data = req.clone().json();

        var selected_group = groups.find(group => group.id === groupid);

        selected_group = {
            ...selected_group,
            title: data.title,
            description: data.description
        }

        return getResponse('group', selected_group);
    }),

    http.patch<{groupid: string}>('http://127.0.0.1:9000/api/group/private/:groupid', ({cookies, params}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {groupid} = params;

        var selected_group = groups.find(group => group.id === groupid);

        selected_group = {
            ...selected_group,
            private: selected_group.private ? false : true
        }

        return getResponse('group', selected_group);
    }),

    http.post<{groupid: string}>('http://127.0.0.1:9000/api/group/request/:groupid', ({cookies, params}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {groupid} = params;

        const selected_group = groups.find(group => group.id === groupid);
        
        selected_group.requests.push(logged);

        return getResponse('requests', selected_group.requests);
    }),

    http.post<{groupid: string, userid: string}>('http://127.0.0.1:9000/api/group/:groupid/request/accept/:userid', 
        ({cookies, params}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {groupid, userid} = params;

        const selected_group = groups.find(group => group.id === groupid);

        users.forEach(user => {
            if(user.id === userid) {
                selected_group.members.push(user);
                selected_group.requests.filter(request => request.id !== user.id);
            }
        });

        return getResponse('requests', selected_group.requests);
    }),

    http.delete<{groupid: string, userid: string}>('http://127.0.0.1:9000/api/group/:groupid/request/reject/:userid', 
        ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    }),

    http.delete<{groupid: string, userid: string}>('http://127.0.0.1:9000/api/group/:groupid/membership/:userid', 
        ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    }),

    http.delete<{groupid: string}>('http://127.0.0.1:9000/api/group/:groupid', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {groupid} = params;

        const updated_groups = groups.filter(group => group.id !== groupid);

        return getResponse('groups', updated_groups);
    })
];
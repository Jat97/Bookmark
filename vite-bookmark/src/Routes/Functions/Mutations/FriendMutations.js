import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useSendFriendRequestMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/user/${data.user.id}/request`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                return res.json();
            })
            .then(json => {
                if(json.server_error) {
                    setSiteError(json.server_error);
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['alerts']});

            const alert_cache = query_client.getQueryData(['alerts']);
            const alert_arr = alert_cache || [];

            const new_alert_arr = {...alert_arr};

            new_alert_arr.alerts.pending.push({
                id: data.user.id,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
                profile_picture: data.user.profile_picture
            });

            query_client.getQueryData(['alerts'], new_alert_arr);

            return {alert_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['alerts'], context.alert_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});
        }
    });

    return mutation;
};

export const useAcceptRequestMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/user/${data.user.id}/accept`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => { 
                return res.json();
            })
            .then(json => {
                if(json.server_error) {
                    setSiteError(json.server_error);
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['alerts']});

            const alert_cache = query_client.getQueryData(['alerts']);
            const alert_arr = alert_cache || [];
            const friend_cache = query_client.getQueryData(['friends']);
            const friend_arr = friend_cache || [];

            const new_alert_arr = {...alert_arr};
            const new_friend_arr = {...friend_arr};

            new_alert_arr.requests.filter(request => request.id !== data.user.id);

            new_friend_arr.friends.push({
                id: data.user.id,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
                profile_picture: data.user.profile_picture
            });

            query_client.setQueryData(['alerts'], new_alert_arr);
            query_client.setQueryData(['logged'], new_friend_arr);

            return {alert_arr, friend_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['alerts'], context.alert_arr);
            query_client.setQueryData(['logged'], context.friend_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
};

export const useRejectRequestMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/user/${data.userid}/reject`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                return res.json();
            })
            .then(json => {
                if(json.server_error) {
                    setSiteError(json.server_error);
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['alerts']});

            const alert_cache = query_client.getQueryData(['alerts']);
            const alert_arr = alert_cache || [];

            const new_alert_arr = {...alert_arr};

            new_alert_arr.alerts.requests.filter(request => request.id.toString() !== data.userid);

            query_client.setQueryData(['alerts'], alert_arr);

            return {alert_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['alerts'], context.alert_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});
        }
    });

    return mutation;
};

export const useRemoveFriendMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/user/${data.userid}/unfriend`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                return res.json();
            })
            .then(json => {
                if(json.server_error) {
                    setSiteError(json.server_error);
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});

            const friend_cache = query_client.getQueryData(['logged']);
            const friend_arr = friend_cache || [];

            const new_friend_arr = {...friend_arr};

            new_friend_arr.friends.filter(friend => friend.id !== userid);

            query_client.setQueryData(['logged'], new_friend_arr);

            return {friend_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.friend_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
};
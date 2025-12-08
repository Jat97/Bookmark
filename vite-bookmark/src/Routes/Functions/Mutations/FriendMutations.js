import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useSendFriendRequestMutation = ([user, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/friend/request/${user}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    return res.json();
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});

            const alert_cache = query_client.getQueryData(['alerts']);
            const alert_arr = alert_cache.alerts.pending || [];

            alert_arr.push({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_picture: user.profile_picture
            });

            return {alert_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['alerts'], context.alert_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});
        }
    });

    return mutation;
};

export const useAcceptRequestMutation = ([user, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://localhost:9000/api/request/accept/${user.id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    return res.json();
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});

            const alert_cache = query_client.getQueryData(['alerts']);
            const alert_arr = alert_cache.alerts || [];
            const friend_arr = query_client.getQueryData(['friends']);

            alert_arr.requests.forEach((alert, index) => {
                if(alert.id === user.id) {
                    alert_arr.splice(index, 1);
                }
            });
            
            friend_arr.push({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_picture: user.profile_picture
            });

            query_client.setQueryData(['alerts'], alert_arr);
            query_client.setQueryData(['friends'], friend_arr);

            return {alert_arr, friend_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['alerts'], context.alert_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});
        }
    });

    return mutation;
};

export const useRejectRequestMutation = ([userid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://localhost:9000/api/request/reject/${userid}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    return res.send();
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});

            const alert_cache = query_client.getQueryData(['alerts']);
            const alert_arr = alert_cache.alerts || [];

            alert_arr.requests.forEach((request, index) => {
                if(request.id === userid) {
                    alert_arr.requests.splice(index, 1);
                }
            });

            query_client.setQueryData(['alerts'], alert_arr);

            return {alert_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['alerts'], context.alert_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['alerts']});
        }
    });

    return mutation;
};

export const useRemoveFriendMutation = ([userid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://localhost:9000/api/unfriend/${userid}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    return res.send();
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['friends']});

            const friend_cache = query_client.getQueryData(['friends']);
            const friend_arr = friend_cache.friends || [];

            const new_friend_arr = friend_arr.forEach((friend, index) => {
                if(friend.id === userid) {
                    new_friend_arr.splice(index, 1);
                }
            });

            query_client.setQueryData(['friends'], new_friend_arr);

            return {friend_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['friends'], context.friend_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['friends']});
        }
    });

    return mutation;
};
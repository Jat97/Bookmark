import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useAddFriendMutation = ([user, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://localhost:127.0.0.1:9000/api/friend/${user.id}`, {
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
            await query_client.invalidateQueries({queryKey: ['friends']});

            const friends_cache = query_client.getQueryData(['friends']);
            const friends_arr = friends_cache.friends || [];

            const new_friends_arr = friends_arr.push({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_picture: user.profile_picture
            });

            query_client.setDataQuery(['friends'], new_friends_arr);

            return {friends_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['friends'], context.friends_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['friends']});
        }
    });

    return mutation;
};

export const useRemoveFriendMutation = ([userid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://127.0.0.1:9000/apiunfriend/${userid}`, {
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
import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useRemoveFriendMutation = ([userid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://127.0.0.1:9000/api/unfriend/${userid}`, {
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
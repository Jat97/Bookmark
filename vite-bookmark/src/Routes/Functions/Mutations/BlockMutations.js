import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useBlockUserMutation = ([user, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://127.0.0.1:9000/api/block/${user.id}`, {
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
            await query_client.invalidateQueries({queryKey: ['blocked']});

            const block_cache = query_client.getQueryData('blocked');
            const block_arr = block_cache.blocked_users || [];

            block_arr.push({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                profile_picture: user.profile_picture
            });

            query_client.setQueryData(['blocked'], block_arr);

            return {block_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['blocked'], context.block_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['blocked']});
        }
    });

    return mutation;
};

export const useUnblockUserMutation = ([userid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://127.0.0.1:9000/api/unblock/${userid}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    res.send();
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['blocked']});

            const block_cache = query_client.setQueryData(['blocked']);
            const block_arr = block_cache.blocked || [];

            const new_block_arr = block_arr.forEach((block, index) => {
                if(block.id === userid) {
                    block_arr.splice(index, 1);
                }
            });

            query_client.setQueryData(['blocked'], new_block_arr);

            return {block_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['blocked'], context.block_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['blocked']});
        }
    });

    return mutation;
};
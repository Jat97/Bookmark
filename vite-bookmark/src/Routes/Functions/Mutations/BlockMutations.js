import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useBlockUserMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: (data) => {
            fetch(`http://localhost:9000/api/user/${data.user.id}/block`, {
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
            await query_client.invalidateQueries({queryKey: ['blocked']});

            const block_cache = query_client.getQueryData('blocked');
            const block_arr = block_cache.blocked_users || [];

            block_arr.push({
                id: data.user.id,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
                profile_picture: data.user.profile_picture
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

export const useUnblockUserMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: (data) => {
            fetch(`http://localhost:9000/api/user/${data.userid}/unblock`, {
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
            await query_client.invalidateQueries({queryKey: ['blocked']});

            const block_cache = query_client.setQueryData(['blocked']);
            const block_arr = block_cache.blocked || [];

            const new_block_arr = block_arr.forEach((block, index) => {
                if(block.id === data.userid) {
                    block_arr.splice(index, 1);
                }
            });

            query_client.setQueryData(['blocked'], new_block_arr);

            return {block_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['blocked'], context.block_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['blocked']});
        }
    });

    return mutation;
};
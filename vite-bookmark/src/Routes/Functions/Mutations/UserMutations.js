import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useToggleHiddenMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/user/hidden/update', {
                method: 'PATCH',
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
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});

            const logged = query_client.getQueryData({queryKey: ['logged']});

            query_client.setQueryData(['logged'], {
                ...logged,
                hidden: logged.hidden ? false : true
            });

            return {logged};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.logged);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
};

export const useEditPictureMutation = ([file, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            const form = new FormData();

            form.append('profilepic', file);

            return await fetch('http://localhost:9000/api/user/picture', {
                method: 'PATCH',
                credentials: 'include',
                body: form
            })
            .then((res) => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    return res.json();
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['user']});

            const logged = query_client.getQueryData(['user']);

            query_client.setQueryData(['logged'], {
                ...logged,
                profile_picture: file
            });

            return {logged};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.logged);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
};

export const useLogOutMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/user/logout', {
                method: 'PATCH',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    return res.json();
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});

            const logged = query_client.getQueryData(['logged'], logged);

            query_client.setQueryData(['logged'], {
                ...logged,
                online: false
            });

            return {logged};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.logged);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
};

export const deleteAccountMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/user/delete', {
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
            .catch(err => setSiteError(err.message))
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
}
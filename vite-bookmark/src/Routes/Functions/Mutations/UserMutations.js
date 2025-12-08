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
            .catch(err => setSiteError(err))
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
            const upload = new File([file], 'upload.jpg');

            const form = new FormData();

            form.append('profilepicture', upload);

            return await fetch('http://localhost:9000/api/user/picture', {
                method: 'PATCH',
                credentials: 'include',
                body: form
            })
            .then(async (res) => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    const data = await res.json();
                    return data.profile_picture
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['user']});

            const logged = query_client.getQueryData(['user']);

            query_client.setQueryData(['logged'], {
                ...logged,
                profile_picture: data
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

export const useLogInMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/login', {
                method: 'PUT',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                } 
                else {
                    const data = res.json();
                    return data;
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['users']});

            const user_cache = query_client.getQueryData(['comments']);
            const user_arr = user_cache.users || [];

            user_arr.forEach(user => {
                if(user.email === data.email) {
                    user = {
                        ...user,
                        online: true
                    }
                }
            });

            return {user_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['users'], context.user_arr);
        },
        onSettled: async () => {
            return query_client.invalidateQueries({queryKey: ['users']});
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
            .catch(err => setSiteError(err))
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
            .catch(err => setSiteError(err))
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
}
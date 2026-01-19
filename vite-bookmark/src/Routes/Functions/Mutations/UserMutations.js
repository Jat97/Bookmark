import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useToggleHiddenMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/user/hidden', {
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

export const useEditProfileMutation = ([user, data, setEditErrors, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/user/profile/edit', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    alma_mater: data.alma_mater,
                    degree: data.degree,
                    description: data.description
                })
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.status}`);
                }
                else {
                    return res.json();
                }
            })
            .then(json => {
            if(json.errors) {
                json.errors.errors.forEach(error => {
                    setEditErrors((prevState) => ({
                        ...prevState,
                        [error.params] : error.message
                    }));
                })
            }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});

            const updated_user  = {
                ...user,
                first_name: data.first_name,
                last_name: data.last_name,
                alma_mater: data.alma_mater,
                degree: data.degree,
                description: data.description
            }

            query_client.setQueryData(['logged'], updated_user);

            return {user}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.user);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
}

export const useDeleteAccountMutation = (setSiteError) => {
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
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

            const logged = query_client.getQueryData(['logged']);

            const updated_logged = {
                ...logged,
                profile: {
                    ...logged.profile,
                    hidden: logged.profile.hidden ? false : true
                }  
            };

            query_client.setQueryData(['logged'], updated_logged);

            return {logged};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.logged);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
};

export const useEditPictureMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            const form = new FormData();

            form.append('profilepic', data.file);

            return await fetch('http://localhost:9000/api/user/picture', {
                method: 'PATCH',
                credentials: 'include',
                body: form
            })
            .then((res) => {
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
            await query_client.invalidateQueries({queryKey: ['user']});

            const logged = query_client.getQueryData(['user']);

            query_client.setQueryData(['logged'], {
                ...logged,
                profile: {
                    ...logged.profile,
                    profile_picture: data.file
                }
            });

            return {logged};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.logged);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
};

export const useCheckNotificationMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/notifications', {
                method: 'PATCH',
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
            await query_client.invalidateQueries({queryKey: ['alerts']});

            const alert_cache = query_client.getQueryData(['alerts']);
            const alert_arr = alert_cache || [];

            const updated_alert_arr = {...alert_arr};

            updated_alert_arr.notifications.forEach((alert, index) => {
                if(!alert.checked) {
                     const new_alert = {
                        ...alert,
                        checked: true
                    }
                    
                    updated_alert_arr.notifications.splice(0, new_alert, index)
                }
            });

            query_client.setQueryData(['alerts'], updated_alert_arr);

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

export const useLogOutMutation = ([navigate, setGuest, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/logout', {
                method: 'PATCH',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    return res.json();
                }
                else {
                    return navigate('/api/login', {rewrite: true});
                }
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

            const logged = query_client.getQueryData(['logged']);

            const logged_out_user = query_client.setQueryData(['logged'], {
                ...logged,
                profile: {
                    ...logged.profile,
                    online: false
                } 
            });

            query_client.setQueryData(['logged'], logged_out_user);

            return {logged};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.logged);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
            
            setGuest(false);
        }
    });

    return mutation;
};

export const useEditProfileMutation = ([setEditErrors, setPopup, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch('http://localhost:9000/api/user', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: data.profile.first_name,
                    last_name: data.profile.last_name,
                    alma_mater: data.profile.alma_mater,
                    degree: data.profile.degree,
                    role: data.profile.role,
                    description: data.profile.description
                })
            })
            .then(res => {
                return res.json();
            })
            .then(json => {
                if(json.errors) {
                    json.errors.errors.forEach(error => {
                        setEditErrors((prevState) => ({
                            ...prevState,
                            [error.params] : error.message
                        }));
                    });
                }
                else {
                    setSiteError(json.error)
                }

                return json;
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['logged']});

            const logged = query_client.getQueryData(['logged']);

            const updated_user  = {
                ...logged,
                profile: {
                    first_name: data.profile.first_name,
                    last_name: data.profile.last_name,
                    alma_mater: data.profile.alma_mater,
                    degree: data.profile.degree,
                    status: data.profile.status,
                    description: data.profile.description
                }
            }

            query_client.setQueryData(['logged'], updated_user);

            return {logged}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['logged'], context.logged);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});

            setPopup(true);
        }
    });

    return mutation;
}

export const useDeleteAccountMutation = (navigate, setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/user', {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    return res.json();
                }
                else {
                    navigate('/api/login', {rewrite: true});
                }
            })
            .then(json => {
                if(json.error) {
                    setSiteError(json.error)
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['logged']});
        }
    });

    return mutation;
}
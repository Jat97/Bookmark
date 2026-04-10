import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useCreateGroupMutation = ([navigate, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
                return await fetch('http://localhost:9000/api/group', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: data.group.title,
                    description: data.group.description,
                    private: data.group.private
                }) 
            })
            .then(res => {
                return res.json();
            })
            .then(json => {
                if(json.error.errors.length > 0) {
                   json.error.errors.forEach(error => {
                        setGroupErrors((prevState) => ({
                            ...prevState,
                            [error.param]: error.msg
                        }));
                    }); 
                }
                else if(json.server_error) {
                    setSiteError(json.server_error);
                }
                else {
                  return json;  
                }
            })
            .catch(err => setSiteError(err.message))  
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];
            
            const new_group = {
                id: group_arr.length * 45,
                title: data.group.title,
                description: data.group.description,
                privacy: data.group.privacy,
                group_image: null,
                members: [],
                requests: [],
                banned_users: []
            }

            const new_group_arr = {...group_arr};

            new_group_arr.groups.push(new_group);

            query_client.setQueryData(['groups'], new_group_arr);

            return {group_arr};
_        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: (data) => {
            navigate(`/api/group/${data.group.id}`, {rewrite: true});
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
}

export const useEditGroupMutation = ([navigate, setTitleError, setPopup, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            const form = new FormData();

            if(data.group_image) {
                const file = new File([data.group.group_image], 'upload.jpg');

                form.append('groupimage', file);
            }

            form.append('title', data.group.title);
            form.append('description', data.group.description);

            return await fetch(`http://localhost:9000/api/group/${data.group.id}`, {
                method: 'PUT',
                credentials: 'include',
                body: form
            })
            .then(res => {
                return res.json();
            })
            .then(json => {
                if(json.title_error) {
                    setTitleError(json.title_error);
                }
                else if(json.server_error) {
                    setSiteError(json.server_error);
                }

                return json;
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group = query_client.getQueryData(['groups']);

            query_client.setQueryData(['groups'], {
                ...group,
                title: data.group.title,
                description: data.group.description,
            });

            return {group};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group);
        },
        onSuccess: (data) => {
            navigate(`/api/group/${data.group.id}`, {rewrite: true});

            setPopup(true);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useGroupRequestMutation = (setSiteError) => {
    const mutation = useMutation({
       mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}/request`, {
                method: 'POST',
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const log_cache = query_client.getQueryData(['logged']);
            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const group = group_arr.find(group => group.id === data.group.id);

            group.requests.push({
                id: log_cache.id,
                first_name: log_cache.first_name,
                last_name: log_cache.last_name,
                profile_picture: log_cache.profile_picture
            });

            const new_group_arr = {...group_arr};

            new_group_arr.groups.forEach((item, index) => {
                if(item.id === group.id) {
                    new_group_arr.groups.splice(index, 1, group);
                } 
            });

            query_client.setQueryData(['groups'], new_group_arr);

            return {group_arr};
       },
       onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
       },
       onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
       },
    });

    return mutation;
};

export const useGroupAcceptMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}/${data.user.id}/accept`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const new_group_arr = {...group_arr};

            new_group_arr.groups.forEach(page => {
                if(page.id === data.group.id) {
                    page.requests.forEach((request) => {
                        if(request.id === data.user.id) {
                            page.requests.filter(request => request.id !== data.user.id);

                            page.members.push({
                                id: data.user.id,
                                first_name: data.user.first_name,
                                last_name: data.user.last_name,
                                profile_picture: data.user.profile_picture
                            });
                        }
                    });
                }
            });

            query_client.setQueryData({queryKey: ['groups'], new_group_arr});

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
}

export const useGroupRejectMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}/${data.user.id}/reject`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const new_group_arr = {...group_arr};

            new_group_arr.groups.forEach(page => {
                if(page.id === group.id) {
                    page.requests.filter(request => request.id !== user.id);
                }
            });

            query_client.setQueryData(['groups'], new_group_arr);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useBanUserMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}/${data.user.id}/ban`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const new_group_arr = {...group_arr};

            new_group_arr.groups.forEach(page => {
                if(page.id === data.group.id) {
                    page.banned_users.push({
                        banned_user: data.user,
                        banning_group: data.group.id
                    });

                    if(page.members.some((member) => member.id === data.user.id)) {
                        page.members.filter(member => member.id !== data.user.id);
                    }
                }
            });

            query_client.setQueryData(['groups'], new_group_arr);

            return {group_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useUnbanUserMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}/${data.user.id}/unban`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const new_group_arr = {...group_arr};

            new_group_arr.groups.forEach(page => {
                if(page.id === data.group.id) {
                    page.banned_users.filter(banned => banned.id !== data.user.id);
                }
            });

            query_client.setQueryData(['groups'], new_group_arr);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useLeaveGroupMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}/leave`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const log_cache = query_client.getQueryData(['logged']);
            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const new_group_arr = {...group_arr};

            new_group_arr.groups.forEach(page => {
                if(page.id === data.group.id) {
                    group.members.filter(member => member.id !== log_cache.profile.id);
                }
            });

            query_client.setQueryData(['groups'], updated_group);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useGroupPrivacyMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}/private`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    private: data.group.private
                })
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];
            
            const new_group_arr = {...group_arr};

            new_group_arr.groups.forEach(page => {
                if(page.id === data.group.id) {
                    page = {
                        ...page,
                        private: page.private ? false: true
                    }
                }
            });

            query_client.setQueryData(['groups', new_group_arr]);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useDeleteGroupMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/group/${data.group.id}`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const new_group_arr = {...group_arr};

            new_group_arr.groups = group_arr.filter(page => page.id !== data.group.id);

            query_client.setDataQuery(['groups'], new_group_arr);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};
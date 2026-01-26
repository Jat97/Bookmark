import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useEditGroupMutation = ([groupData, file, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            const form = new FormData();

            form.append('groupimage', file);
            form.append('title', groupData.title);
            form.append('description', groupData.description);

            return await fetch(`http://localhost:9000/api/${groupData.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: form
            })
            .then(res => {
                if(!res.ok) {
                    return res.json();
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group = query_client.getQueryData(['groups']);

            query_client.setQueryData(['groups'], {
                ...group,
                title: data.title,
                description: data.description,
                group_image: data.image
            });

            return {group};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useGroupRequestMutation = ([logged, group, setSiteError]) => {
    const mutation = useMutation({
       mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${group.id}/request`, {
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
            .catch(err => setSiteError(err.message))
       },
       onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['group_requests']});

            const request_cache = query_client.getQueryData(['group_requests']);
            const request_arr = request_cache.group_requests || [];

            console.log(request_cache.group_requests);

            const new_request_arr = request_arr.push({
                id: logged.id,
                first_name: logged.first_name,
                last_name: logged.last_name,
                profile_picture: logged.profile_picture
            });

            query_client.setDataQuery(['group_requests'], new_request_arr);

            return {request_arr};
       },
       onError: (err, data, context) => {
            query_client.setQueryData(['group_requests'], context.request_arr);
       },
       onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['group_requests']});
       }
    });

    return mutation;
};

export const useGroupAcceptMutation = ([user, group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${group}/${user.id}/accept`, {
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
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['group']});

            const group_cache = query_client.getQueryData(['group']);
            const group_arr = group_cache.groups || [];

            group_arr.forEach(page => {
                if(page.group.id === group) {
                    page.requests.forEach((request, index) => {
                        if(request.id === user.id) {
                            page.requests.splice(index, 1);

                            page.memberships.push({
                                id: user.id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                profile_picture: user.profile_picture
                            });
                        }
                    });
                }
            });

            query_client.setDataQuery({queryKey: ['groups'], group_arr});

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
            await query_client.invalidateQueries({queryKey: ['group_requests']});
        }
    });

    return mutation;
}

export const useGroupRejectMutation = ([user, group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${group}/${user.id}/reject`, {
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
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});

            const request_cache = query_client.getQueryData(['groups']);
            const request_arr = request_cache.groups.requests || [];

            const new_request_arr = request_arr.forEach((request, index) => {
                if(request.id === user.id) {
                    request_arr.splice(index, 1);
                }
            });

            query_client.setQueryData(['groups'], new_request_arr);

            return {request_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['group_requests'], context.request_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['group_requests']});
        }
    });

    return mutation;
};

export const useBanUserMutation = ([user, group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api${group.id}/${user.id}/ban`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const banning_group = group_arr.find((page) => page.id === group.id);

            const updated_group = banning_group.banned_users.push({
                banned_user: user.id,
                banning_group: group.id
            });

            updated_group.members.filter(member => member.id !== user.id);

            query_client.setQueryData(['groups'], updated_group);

            return {banning_group}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.banning_group);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useUnbanUserMutation = ([user, group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${group.id}/${user.id}/unban`, {
                method: 'DELETE',
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];

            const unbanning_group = group_arr.find((page) => page.id === group.id);

            const updated_group = unbanning_group.banned_users.filter(banned => banned.id !== user.id);

            query_client.setQueryData(['groups'], updated_group);

            return {unbanning_group};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.unbanning_group);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useLeaveGroupMutation = ([user, group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${group.id}/leave`, {
                method: 'DELETE',
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache || [];
          
            const updated_group = group_arr.forEach(page => {
                if(page.id === group.id) {
                    return group.members.filter(member => member.id !== user.id);
                }
            });

            query_client.setQueryData(['groups'], updated_group);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useGroupPrivacyMutation = ([group, setTitleError, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${group}`, {
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
            .then(json => {
                if(json.errors.title_error) {
                    setTitleError(json.errors.title_error);
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache.groups || [];

            const new_group_arr = group_arr.forEach(page => {
                if(page.id === group) {
                    page = {
                        ...page,
                        private: page.private ? false : true
                    }
                }
            });

            query_client.setQueryData(['groups', new_group_arr]);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useDeleteGroupMutation = ([group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${group}`, {
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
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});

            const group_cache = query_client.getQueryData(['groups']);
            const group_arr = group_cache.groups || [];

            const new_group_arr = group_arr.forEach((page, index) => {
                if(page.id === group) {
                    group_arr.splice(index, 1);
                }
            });

            query_client.setDataQuery(['groups'], new_group_arr);

            return {group_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.group_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};
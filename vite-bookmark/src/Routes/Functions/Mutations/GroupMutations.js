import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../client';

export const useEditGroupMutation = ([group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/group/edit/${group}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async (res) => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    const data = await res.json();
                    return data;
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async (data) => {
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
            return await fetch(`http://127.0.0.1:9000/api/group/request/${group}`, {
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
            await query_client.invalidateQueries({queryKey: ['group_requests']});

            const request_cache = query_client.getQueryData(['group_requests']);
            const request_arr = request_cache.group_requests || [];

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
            return await fetch(`http://127.0.0.1:9000/api/group/${group}/request/accept/${user.id}`, {
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

export const useGroupRejection = ([user, group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/group/${group}/request/reject/${user.id}`, {
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
            await query_client.invalidateQuery({queryKey: ['groups']});

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

export const useTerminateMembershipMutation = ([logged, group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/group/${group}/membership/${logged}`, {
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
            await query_client.invalidateQueries({queryKey: ['groups']});

            const member_cache = query_client.getQueryData(['groups']);
            const member_arr = member_cache.groups || [];

            member_arr.forEach(page => {
                if(page.id === group) {
                    page.membership.forEach((member, index) => {
                        if(member.id === logged) {
                            page.membership.splice(index, 1);
                        } 
                    });
                }
            });

            query_client.setQueryData(['groups'], member_arr);

            return {member_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['groups'], context.member_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['groups']});
        }
    });

    return mutation;
};

export const useGroupPrivacyMutation = ([group, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/group/privacy/${group}`, {
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
            return await fetch(`http://127.0.0.1:9000/api/group/${group}`, {
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
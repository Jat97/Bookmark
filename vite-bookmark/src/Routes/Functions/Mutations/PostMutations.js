import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useCreatePostMutation = ([setText, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch('http://localhost:9000/api/post', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    groupid: data.poster.title && data.poster.id,
                    text: data.text
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
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache || [];

            const updated_post_arr = {...post_arr};

            const new_post = {
                id: post_arr.length + 25,
                original_poster: poster.first_name ? poster : null,
                text: text,
                posted: Date.now(),
                original_group: poster.title ? poster : null,
                shared_by: null,
                edited: null,
                likes: []
            }

            updated_post_arr.posts.push(new_post);

            query_client.setQueryData(['posts'], updated_post_arr);

            return {post_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.post_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
            setText('');
        }
    });

    return mutation;
};

export const useEditPostMutation = ([setText, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/post/${data.postid}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: data.text
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
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache || [];

            const updated_post_arr = {...post_arr};

            updated_post_arr.posts.forEach(post => {
                if(post.id === data.postid) {
                    post = {
                        ...post,
                        text: data.text,
                        edited: Date.now()
                    }
                }
            });

            query_client.setQueryData(['posts'], updated_post_arr);

            return {post_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.post_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
            setText('');
        }
    });

    return mutation;
};

export const useSharePostMutation = ([postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/post/${postid}/share`, {
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
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const log_cache = query_client.getQueryData(['logged']);
            const post_arr = post_cache || [];

            const updated_post_arr = {...post_arr};

            const shared_post = post_arr.posts.find(post => post.id === postid);

            updated_post_arr.posts.push({
                id: post_arr.length + 25,
                original_poster: shared_post.original_poster,
                text: shared_post.text,
                posted: shared_post.posted,
                original_group: shared_post.original_group,
                shared_by: log_cache.profile,
                edited: shared_post.edited,
                likes: []
            });

            query_client.setQueryData(['posts'], updated_post_arr);

            return {post_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.post_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useDeletePostMutation = ([postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/post/${postid}`, {
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
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache || [];
            
            const updated_post_arr = {...post_arr};

            updated_post_arr.posts.filter(post => post.id !== postid);

            query_client.setQueryData(['posts'], updated_post_arr);

            return {post_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.post_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useCreateCommentMutation = ([postid, text, profile, setText, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/post/${postid}/comment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    groupid: profile.title && profile.id
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
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache || [];

            const updated_comment_arr = {...comment_arr};

            const comment = {
                id: comment_arr.length + 50,
                commenting_user: profile.first_name && {
                    id: profile.id, 
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    profile_picture: profile.profile_picture
                },
                commenting_group: profile.title && {
                    title: profile.title,
                    group_image: profile.group_image
                },
                text: text,
                posted: Date.now(),
                reply_to: null,
                likes: [],
                replies: []
            }

            updated_comment_arr.comments.push(comment);

            query_client.setQueryData(['comments'], updated_comment_arr);

            return {comment_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.comment_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
            setText('');
        }
    });

    return mutation;
};

export const useEditCommentMutation = ([commentid, text, setText, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/comment/${commentid}`, {
                method: 'PUT',
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
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache || [];

            const updated_comment_arr = {...comment_arr};

            updated_comment_arr.comments.forEach(comment => {
                if(comment.id === commentid) {
                    comment = {
                        ...comment,
                        text: text
                    }
                }
            });

            query_client.setQueryData(['comments'], updated_comment_arr);

            return {comment_arr}
        },
        onError: (err, data, context) => {
            query_client.getQueryData(['comments'], context.comment_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
            setText('');
        }
    });

    return mutation;
};

export const useDeleteCommentMutation = ([commentid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/comment/${commentid}`, {
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
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache || [];

            const updated_comment_arr = {...comment_arr};

            updated_comment_arr.comments.filter(comment => comment.id !== commentid);

            query_client.setQueryData(['comments'], updated_comment_arr);

            return {comment_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.comment_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
        }
    });

    return mutation;
};
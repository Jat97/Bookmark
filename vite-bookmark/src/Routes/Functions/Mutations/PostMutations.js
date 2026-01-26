import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useCreatePostMutation = ([poster, text, setText, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch('http://localhost:9000/api/post', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text
                })
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
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache.posts || [];

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

            post_arr.push(new_post);

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

export const useEditPostMutation = ([postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${postid}`, {
                method: 'PUT',
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
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache.posts || [];

            post_arr.forEach(post => {
                if(post.id === postid) {
                    post = {
                        ...post,
                        text: data.text,
                        edited: data.edited
                    }
                }
            });

            return {post_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.post_arr);
        },
        onSettled: async () => {
            return await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useSharePostMutation = ([user, postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${postid}/share`, {
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
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache.posts || [];

            const shared_post = post_arr.find(post => post.id === postid);

            post_arr.push({
                id: post_arr.length + 25,
                original_poster: shared_post.original_poster,
                text: shared_post.text,
                posted: shared_post.posted,
                original_group: shared_post.original_group,
                shared_by: user,
                edited: shared_post.edited
            });

            return {post_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.post_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useDeletePostMutation = ([postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${postid}`, {
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
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache.posts || [];

            post_arr.forEach((post, index) => {
                if(post.id === postid) {
                    post_arr.splice(index, 1);
                }
            });

            return {post_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.post_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useCreateCommentMutation = ([postid, text, profile, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${postid}`, {
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
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

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
                posted: Data.now(),
                reply_to: null,
                likes: [],
                replies: []
            }

            comment_arr.push(comment);

            return {comment_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.comment_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
        }
    });

    return mutation;
};

export const useEditCommentMutation = ([commentid, text, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${commentid}`, {
                method: 'PUT',
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
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

            comment_arr.forEach(comment => {
                if(comment.id === commentid) {
                    comment = {
                        ...comment,
                        text: text
                    }
                }
            });

            return {comment_arr}
        },
        onError: (err, data, context) => {
            query_client.getQueryData(['comments'], context.comment_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
        }
    });

    return mutation;
};

export const useDeleteCommentMutation = ([commentid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/${commentid}`, {
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
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

            comment_arr.forEach((comment, index) => {
                if(comment.id === commentid) {
                    comment_arr.splice(index, 1);
                }
            });

            return {comment_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.comment_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
        }
    });

    return mutation;
};
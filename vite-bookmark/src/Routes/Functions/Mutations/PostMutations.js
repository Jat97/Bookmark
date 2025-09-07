import {QueryClient, useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useCreatePostMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/post`, () => ({
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
                    const data = res.json();
                    return data;
                }
            })
            .catch(err => setSiteError(err))
        )},  
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache.posts || [];

            const new_post = {
                id: post_arr.length + 25,
                original_poster: data.original_poster ? data.original_poster : null,
                text: data.text,
                posted: data.posted,
                original_group: data.original_group ? data.original_group : null,
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
        }
    });

    return mutation;
};

export const useEditPostMutation = ([postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/post/${postid}`, {
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
                    const data = res.json();
                    return data;
                }
            })
            .catch(err => setSiteError(err))
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

export const useDeletePostMutation = ([postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/post/${postid}`, {
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

export const useParentCommentMutation = ([postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/post/comment/${postid}`, {
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
                    const data = res.json();
                    return data;
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

            const comment = {
                id: comment_arr + 50,
                commenting_user: comment.commenting_user,
                commenting_group: comment.commenting_group,
                text: comment.text,
                posted: comment.posted,
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

export const useReplyCommentMutation = ([commentid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/comment/reply/${commentid}`, {
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
                    const data = res.json();
                    return data;
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

            comment_arr.forEach(comment => {
                if(comment.id === commentid) {  
                    const reply = {
                        id: comment_arr + 75,
                        commenting_user: data.commenting_user,
                        commenting_group: data.commenting_group,
                        text: data.text,
                        posted: data.posted,
                        reply_to: commentid,
                        likes: data.likes,
                        replies: data.replies
                    }   

                    comment.replies.push(reply);
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

export const useEditCommentMutation = ([commentid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://127.0.0.1:9000/api/comment/edit/${commentid}`, {
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
                    const data = res.json();
                    return data;
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['comments']});

            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

            comment_arr.forEach(comment => {
                if(comment.id === commentid) {
                    comment = {
                        ...comment,
                        text: data.text
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
            return await fetch(`http://127.0.0.1:9000/api/comment/${commentid}`, {
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
import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useLikePostMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/post/${data.postid}/like`, {
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
            await query_client.cancelQueries({queryKey: ['posts']});

            const log_cache = query_client.getQueryData(['logged']);
            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache.posts || [];

            const new_liked_posts = post_arr.map(content => {
                if(content.id === postid) {
                    if(!post.likes.some((like) => like.liking_user === log_cache.id)) {
                        post.likes.push({
                            id: log_cache.id,
                            first_name: log_cache.first_name,
                            last_name: log_cache.last_name,
                            profile_picture: log_cache.profile_picture
                        });
                    }
                }
            });

            await query_client.setQueryData(['posts'], new_liked_posts);

            return {post_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.liked_posts_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useUnlikePostMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/post/${data.postid}/unlike`, {
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
            await query_client.invalidateQueries({queryKey: ['posts']});

            const post_cache = query_client.getQueryData(['posts']);
            const post_arr = post_cache.posts || [];

            const new_liked_posts = post_arr.map(post => {
                if(post.id === data.postid) {
                    return post.likes.filter(like => like.id !== logged.id);
                }
            });

            query_client.setQueryData(['posts'], new_liked_posts);

            return {post_arr};
        },
        onError: (err, data, context) => {
            return query_client.setQueryData(['posts'], context.liked_posts_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useLikeCommentMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: (data) => {
            fetch(`http://localhost:9000/api/comment/${data.commentid}/like`, {
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
            await query_client.invalidateQueries({queryKey: ['comments']});

            const log_cache = query_client.getQueryData(['logged']);
            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

            const liked_comments_arr = comment_arr.map(comment => {
                if(comment.id === data.commentid) {
                    if(!comment.likes.some((like) => like.id === logged.id)) {
                        comment.likes.push({
                            id: logged.id,
                            first_name: log_cache.first_name,
                            last_name: log_cache.last_name,
                            profile_picture: log_cache.profile_picture
                        });
                    }
                }
            }); 

            query_client.setQueryData(['comments'], liked_comments_arr);

            return {comment_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.liked_comments_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKeys: ['comments']});
        }
    });

    return mutation;
};

export const useUnlikeCommentMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: (data) => {
            fetch(`http://localhost:9000/api/comment/${data.commentid}/unlike`, {
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
            await query_client.invalidateQueries({queryKey: ['comments']});

            const log_cache = query_client.getQueryData(['logged']);
            const comment_cache = query_client.getQueryData(['comments']);
            const comment_arr = comment_cache.comments || [];

            const new_liked_comments = comment_arr.map(comment => {
                if(comment.id === data.commentid) {
                    return comment.likes.filter(like => like.id !== log_cache.id);
                }
            });

            query_client.setQueryData(['comments'], new_liked_comments);

            return {comment_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.liked_comments_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
        }
    });

    return mutation;
};
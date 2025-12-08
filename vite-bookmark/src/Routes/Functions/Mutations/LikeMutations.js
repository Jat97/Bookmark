import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useLikePostMutation = ([logged, postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/post/like/${postid}`, {
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
            await query_client.cancelQueries({queryKey: ['posts']});

            const liked_posts_cache = query_client.getQueryData(['posts']);
            const liked_posts_arr = liked_posts_cache || [];

            const new_liked_posts = liked_posts_arr.forEach(content => {
                if(content.post.id === postid) {
                    if(content.likes.some((like) => like.liking_user === logged) === false) {
                        content.likes.push({
                            id: content.likes.length + 14,
                            liking_user: logged,
                            liked_post: postid,
                            liked_comment: null
                        });
                    }
                }
            });

            await query_client.setQueryData(['posts'], new_liked_posts);

            return {liked_posts_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['posts'], context.liked_posts_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useUnlikePostMutation = ([logged, postid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/post/unlike/${postid}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.sendStatus}`);
                }
                else {
                    res.send();
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.cancelQueries({queryKey: ['posts']});

            const liked_posts_cache = query_client.setQueryData(['posts']);
            const liked_posts_arr = liked_posts_cache.posts || [];

            const new_liked_posts = liked_posts_arr.forEach(content => {
                content.likes.forEach((like, index) => {
                    if(like.id === logged.id) {
                        return liked_posts_arr.splice(index, 1);
                    }
                });
            });

            query_client.setQueryData(['posts'], new_liked_posts);

            return {liked_posts_arr};
        },
        onError: (err, data, context) => {
            return query_client.setQueryData(['posts'], context.liked_posts_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['posts']});
        }
    });

    return mutation;
};

export const useLikeCommentMutation = ([logged, commentid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://localhost:9000/api/comment/like/${commentid}`, {
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
            await query_client.invalidateQueries({queryKey: ['comments']});

            const liked_comments_cache = query_client.getQueryData(['comments']);
            const liked_comments_arr = liked_comments_cache || [];

            liked_comments_arr.push({
                id: logged.id,
                first_name: logged.first_name,
                last_name: logged.last_name,
                profile_picture: logged.profile_picture
            });

            query_client.setQueryData(['comments'], liked_comments_arr);

            return {liked_comments_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.liked_comments_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKeys: ['comments']});
        }
    });

    return mutation;
};

export const useUnlikeCommentMutation = ([logged, commentid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: () => {
            fetch(`http://localhost:9000/api/comment/unlike/${commentid}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
                else {
                    res.send();
                }
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});

            const liked_comments_cache = query_client.getQueryData(['comments']);
            const liked_comments_arr = liked_comments_cache || [];

            const new_liked_comments = liked_comments_arr.forEach(content => {
                content.likes.forEach((like, index) => {
                    if(like.id === logged.id) {
                        liked_comments_arr.splice(index, 1);
                    }
                });
            });

            query_client.setQueryData(['comments'], new_liked_comments);

            return {liked_comments_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['comments'], context.liked_comments_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['comments']});
        }
    });

    return mutation;
};
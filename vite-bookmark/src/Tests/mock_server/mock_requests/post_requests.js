import {http} from 'msw';
import {posts} from '../mock_data/mock_posts';
import {blockRequest, getResponse} from './request_functions';

export const post_requests = [
    http.get('http:127.0.0.1:9000/api/posts', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse('posts', cookies.usertoken ? posts : []);
    }),

    http.post('http://127.0.0.1:9000/api/post', ({cookies, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const data = req.clone().json();

        const new_post = {
            id: posts.length * 4,
            original_poster: logged,
            text: data.text,
            posted: Date.now(),
            edited: null,
            shared_by: null,
            likes: []
        }

        return getResponse('post', new_post);
    }),

    http.put<{postid: string}>('http://127.0.0.1:9000/api/post/edit/:postid', ({cookies, params, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {postid} = params;

        var selected_post = posts.find(post => post.id === postid);

        selected_post = {
            ...selected_post,
            text: data.text,
            edited: Date.now()
        }

        return getResponse('post', selected_post);
    }),

    http.post<{postid: string}>('http://127.0.0.1:9000/api/post/like/:postid', ({cookies, params}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {postid} = params;

        const selected_post = posts.find(post => post.id === postid);

        selected_post.likes.push(logged);

        return getResponse('like', updated_post.likes[updated_post.likes.length - 1]);
    }),

    http.delete<{postid: string}>('http://127.0.0.1:9000/api/post/unlike/:postid', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    }),

    http.delete<{postid: string}>('http://127.0.0.1:9000/api/post/:postid', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    })
];
import {http} from 'msw';
import {comments} from '../mock_data/mock_comments';
import {posts} from '../mock_data/mock_posts';
import {blockRequest, getResponse, logged} from './request_functions';

const getPostComments = (comments, id) => {
    const post_comments = comments.filter(comment => comment.post === id);

    return post_comments;
}

export const comment_requests = [
    http.get<{postid: string}>('http://127.0.0.1:9000/api/post/:postid/comments', ({cookies, params}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {postid} = params;

        const post_comments = getPostComments(comments, postid);

        return getResponse('comments', post_comments);
    }),

    http.post<{postid: string}>('http://127.0.0.1:9000/api/post/comment/:postid', ({cookies, params, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {postid} = params;
        const data = req.clone().json();

        const post_comments = getPostComments(comments, postid);

        const new_comment = {
            id: post_comments.length * 15,
            post: postid,
            commenting_user: logged,
            text: data.text,
            posted: Date.now(),
            likes: [],
            replies: []
        }

        post_comments.push(new_comment);

        return getResponse('comment', post_comments[post_comments.length - 1]);
    }),

    http.post<{commentid: string}>('http://127.0.0.1:9000/api/comment/reply/:commentid', ({cookies, params, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {commentid} = params;
        const data = req.clone().json();

        const post_comments = getPostComments(comments, commentid);

        const reply = post_comments.forEach(comment => {
            if(comment.id === commentid) {
                const new_comment = {
                    id: post_comments.length * 15,
                    post: comment.post,
                    commenting_user: logged,
                    text: data.text,
                    posted: Date.now(),
                    likes: [],
                    replies: []
                }

                post_comments.replies.push(new_comment);

                return reply;
            }
        });        

        return getResponse('reply', reply);
    }),

    http.put<{commentid: string}>('http://127.0.0.1:9000/api/comment/edit/:commentid', ({cookies, params, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {commentid} = params;
        const data = req.clone().json();

        var selected_comment = comments.find(comment => comment.id === commentid);

        selected_comment = {
            ...selected_comment,
            text: data.text
        }

        return getResponse('comment', selected_comment);
    }),

    http.post<{commentid: string}>('http://127.0.0.1:9000/api/comment/like/:commentid', ({cookies, params, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {commentid} = params;

        const selected_comment = comments.find(comment => comment.id === commentid);

        selected_comment.likes.push(logged);
    }), 

    http.delete<{commentid: string}>('http://127.0.0.1:9000/api/comment/unlike/:commentid', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    }),

    http.delete<{commentid: string}>('http://127.0.0.1:9000/api/comment/:commentid', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    })
];
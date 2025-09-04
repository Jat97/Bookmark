import {http} from 'msw';
import {chats} from '../mock_data/mock_chats';
import {blockRequest, getResponse, logged} from './request_functions';

export const chat_requests = [
    http.get('http://127.0.0.1:9000/api/chats', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse('chats', chats);
    }),

    http.post<{userid: string}>('http://127.0.0.1:9000/api/messages/:userid', ({cookies, params, req}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        const {userid} = params;
        const data = req.clone().json();

        const selected_chat = chats.find(chat => chat.user === userid);

        const new_message = {
            id: selected_chat.messages.length + 20,
            sending_user: logged,
            receiving_user: userid,
            text: data.text,
            sent: Date.now(),
            checked: false
        }

        selected_chat.messages.push(new_message);

        return getResponse('message', new_message);
    }),

    http.delete<{chatid: string}>('http://127.0.0.1:9000/api/chat/:chatid', ({cookies}) => {
        if(!cookies.usertoken || !cookies.signtoken) {
            return blockRequest();
        }

        return getResponse(undefined, undefined);
    })
];
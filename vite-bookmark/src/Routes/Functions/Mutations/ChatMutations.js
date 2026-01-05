import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useSendMessageMutation = ([user, file, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            const form = new FormData();

            FormData.append([file], 'upload.jpg');

            return await fetch(`http://localhost:9000/api/message/${user.id}`, {
                method: 'POST',
                credentials: 'include',
                body: form
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
            .catch(err => setSiteError(err.message))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['chats']});

            const message_cache = query_client.getQueryData(['chats']);
            const message_arr = message_cache.messages || [];

            message_arr.push({
                receiving_user: user,
                image: data.image,
                text: data.text,
                sent: Date.now()
            });

            query_client.setQueryData(['chats'], message_arr);

            return {message_arr}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['chats'], context.message_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries(['chats']);
        }
    });

    return mutation;
};

export const deleteChatMutation = ([chatid, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async () => {
            return await fetch(`http://localhost:9000/api/chat/${chatid}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
            })
            .catch(err => setSiteError(err.message))
        },
        onMutate: async () => {
            await query_client.invalidateQueries({queryKey: ['chats']});

            const chat_cache = query_client.getQueryData(['chats']);
            const chat_arr = chat_cache || [];

            chat_arr.forEach((chat, index) => {
                if(chat.chat.id === chatid) {
                    chat_arr.splice(index, 1);
                }
            });

            return {chat_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['chats'], context.chat_arr);
        },
        onSettled: async () => {
            await query_client.invalidateQueries({queryKey: ['chats']});
        }
    });

    return mutation;
};
import {useMutation} from '@tanstack/react-query';
import {query_client} from '../../../client';

export const useCreateChatMutation = ([setSelectedChat, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/chat/${data.user.id}`, {
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

                return json;
            })
            .catch(err => setSiteError(err))
        },
        onMutate: async (data) => {
            await query_client.invalidateQueries({queryKey: ['chats']});

            const chat_cache = query_client.getQueryData(['chats']);
            const chat_arr = chat_cache.chats || [];

            const updated_chat_arr = [...chat_arr];

            updated_chat_arr.push({
                chat: {
                    id: chat_arr.length + 20,
                    user: data.user,
                    last_message_sent: null
                },
                messages: []
            });

            query_client.setQueryData(['chats'], {chats: updated_chat_arr});

            return {chat_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['chats'], context.chat_arr);
        },
        onSuccess: async (data) => {
            await query_client.invalidateQueries({queryKey: ['chats']});
            const chat_cache = query_client.getQueryData(['chats']);

            const found_chat = chat_cache.chats.find(chat => chat.chat.user.id === data.user.id);

            setSelectedChat(found_chat);
        }
    });

    return mutation;
};

export const useSendMessageMutation = ([setText, setSiteError]) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            const form = new FormData();

            if(file) {
                form.append('chatimage', data.file);
            }

            form.append('text', data.text);
            
            return await fetch(`http://localhost:9000/api/chat/${data.chat.user.id}/message`, {
                method: 'POST',
                credentials: 'include',
                body: form
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
            await query_client.invalidateQueries({queryKey: ['chats']});

            const chat_cache = query_client.getQueryData(['chats']);
            const log_cache = query_client.getQueryData(['logged']);
            const chat_arr = chat_cache.chats || [];

            var updated_chat_arr;

            updated_chat_arr = [...chat_arr];

            updated_chat_arr.forEach(item => {
                item.chat.last_message_sent = {
                    text: data.text,
                    image: data.file,
                    sending_user: log_cache.profile.id,
                    receiving_user: data.chat.user.id,
                    sent: Date.now(),
                    checked: false
                }
                
                if(item.chat.user.id === data.chat.user.id) {
                    item.messages.push({
                        sending_user: log_cache.profile.id,
                        receiving_user: data.chat.user.id,
                        image: data.file,
                        text: data.text,
                        sent: Date.now()
                    });
                }
            });

            query_client.setQueryData(['chats'], {chats: updated_chat_arr});

            return {chat_cache}
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['chats'], context.chat_cache);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries(['chats']);
            setText('');
        }
    });

    return mutation;
};

export const useDeleteChatMutation = (setSiteError) => {
    const mutation = useMutation({
        mutationFn: async (data) => {
            return await fetch(`http://localhost:9000/api/chat/${data.id}`, {
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
        onMutate: async (id) => {
            await query_client.invalidateQueries({queryKey: ['chats']});

            const chat_cache = query_client.getQueryData(['chats']);
            const chat_arr = chat_cache || [];

            const updated_chat_arr = {...chat_arr};

            updated_chat_arr.chats.forEach((chat, index) => {
                if(chat.id === id) {
                    updated_chat_arr.chats.splice(index, 1);
                }
            });

            query_client.setQueryData(['chats'], updated_chat_arr);

            return {chat_arr};
        },
        onError: (err, data, context) => {
            query_client.setQueryData(['chats'], context.chat_arr);
        },
        onSuccess: async () => {
            await query_client.invalidateQueries({queryKey: ['chats']});
        }
    });

    return mutation;
};
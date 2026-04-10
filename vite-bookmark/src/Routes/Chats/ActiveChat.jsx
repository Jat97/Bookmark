import {useState, useEffect} from 'react';
import {ChevronLeftIcon, PaperClipIcon, PaperAirplaneIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useBookStore} from '../../Context/bookStore';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useSendMessageMutation} from '../Functions/Mutations/ChatMutations';
import Message from './Message';

const ActiveChat = ({chat}) => {
    const [image, setImage] = useState({file: null, reader: null});
    const [text, setText] = useState('');

    const authorized = useBookStore((state) => state.authorized);
    const selected_chat = useBookStore((state) => state.selected_chat);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    
    useEffect(() => {
        const unread_messages = selected_chat.messages.some((message) => 
            !message.checked && message.sending_user !== loggedData.data.profile.id
        );

        if(!unread_messages) {
            return;
        }
        else {
            fetch(`http://localhost:9000/api/chat/${selected_chat.chat.user?.id}`, {
                method: 'PATCH',
                credentials: 'include'
            })
            .then(res => {
                if(!res.ok) {
                    throw Error(`Error ${res.status}: ${res.statusText}`);
                }
            })
            .catch(err => setSiteError(err))
        } 
    }, [selected_chat]);
    
    const send_message_mutation = useSendMessageMutation([selected_chat.chat, image.file, text, setText, setSiteError]);

    const uploadImage = () => {
        const file = document.querySelector('#file_upload');

        const file_reader = new FileReader();

        file_reader.addEventListener('loadend', () => {
            setImage({file: file.files[0], reader: file_reader.result});
        });

        file_reader.readAsDataURL(file.files[0]);
    };

    const removeImage = () => {
        setImage({file: null, reader: null});
    };

    const composeMessage = (e) => {
        setText(e.target.value);
    };

    const sendMessage = () => {
        send_message_mutation.mutate();
    };

    const disableChat = () => {
        setSelectedChat(null);
    };

    return (
        <div className='absolute top-0 left-0 flex flex-col bg-slate-200 max-h-screen w-screen z-40 
            md:static md:overflow-y-auto md:h-screen md:w-5xl'>
            <div className='flex flex-col gap-y-3 h-full'>
                <div className='relative flex flex-col items-center gap-y-4 shrink-0'>
                    <div className='absolute top-0 left-[2px] flex justify-around items-center gap-x-2 
                        text-blue-600 md:hidden' onClick={() => disableChat()}>
                        <ChevronLeftIcon className='h-6 fill-blue-600' />

                        <span> Back to chats </span>
                    </div>
                    
                    <span className='font-semibold text-lg md:text-sm'> 
                        {`${chat.chat.user?.first_name} ${chat.chat.user?.last_name}`} 
                    </span>
                </div>

                <div className='flex-1 flex flex-col gap-y-3 overflow-y-auto h-[700px] z-20'>
                    {chat.messages?.map(message => {
                        return <Message 
                            message={message}
                            chat={chat}  
                            is_logged={message.sending_user === loggedData.data?.profile?.id}
                        />
                    })}
                </div>
                
                <div className='shrink-0'>
                    {image.reader &&
                        <div className='border border-slate-200 w-[150px]'>
                            <div className='absolute right-[5px] bg-zinc-400 rounded-full p-0.5 z-50 hover:bg-slate-100'
                                onClick={() => removeImage()}>
                                <XMarkIcon className='h-6' />
                            </div>
                            
                            <img src={image.reader} className='object-cover max-w-[150px]'></img> 
                        </div>   
                    }

                    <div className='flex justify-between items-center bg-orange-700/50 w-full'>
                        <input type='text' className='bg-slate-200 rounded-full p-1 w-[400px] md:w-[750px] focus:bg-white'
                            placeholder='What do you want to say?' value={text} onChange={(e) => composeMessage(e)}>
                        </input>

                        <div className='flex justify-around items-center w-1/3'>
                            <label htmlFor='file_upload' className='inline md:hidden'>
                                <input type='file' id='file_upload' className='hidden' onChange={() => uploadImage()}></input>
                                <PaperClipIcon className='h-6 fill-amber-300' />
                            </label>

                            <button type='button' className='flex flex-col items-center bg-amber-300 
                                rounded-full w-[75px] hover:bg-yellow-100' 
                                onClick={() => sendMessage()}>
                                <PaperAirplaneIcon className='h-6 fill-amber-200' />
                            </button>
                        </div>                            
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveChat;
import {useState} from 'react';
import {ChatBubbleLeftEllipsisIcon, PaperClipIcon, PaperAirplaneIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useBookStore} from '../../Context/bookStore';
import {useSendMessageMutation} from '../Functions/Mutations/ChatMutations';
import Message from './Message';

const ActiveChat = ({chat}) => {
    const [image, setImage] = useState({file: null, reader: null});

    const setSiteError = useBookStore((state) => state.setSiteError);
    
    const send_message_mutation = useSendMessageMutation([chat, image.file, setSiteError]);

    const uploadImage = () => {
        const file = document.querySelector('#file_upload');

        const file_reader = new FileReader();

        file_reader.addEventListener('loadend', () => {
            setImage({file: file.files[0], reader: file_reader.result});
        });

        file_reader.readAsDataURL(file.files[0]);
    }

    const removeImage = () => {
        setImage({file: null, reader: null});
    };

    const sendMessage = () => {
        send_message_mutation.mutate();
    }

    console.log(chat);

    return (
        <div>
            {chat === undefined ? 
                <div>
                    <ChatBubbleLeftEllipsisIcon className='max-h-12 fill-slate-200' />

                    <p className='text-slate-200 font-semibold'> You don't seem to have any chats! </p>
                </div>
            :
                <div>
                    <div className='flex flex-col items-center md:absolute md:left-[200px]'>
                        <span className='font-semibold'> {`${chat.first_name} ${chat.last_name}`} </span>
                    </div>

                    {chat.messages?.map(message => {
                        return <Message message={message} 
                            is_logged={message.sending_user.id === chat.user_1 ? true : false} />
                    })}

                    <div>
                        {image.reader &&
                            <div className='border border-slate-200'>
                                <div className='float-right bg-zinc-400 rounded-full p-1 hover:bg-slate-100'
                                    onClick={() => removeImage()}>
                                    <XMarkIcon className='h-6' />
                                </div>
                                
                                <img src={image.reader}></img> 
                            </div>   
                        }

                        <div className='absolute bottom-0 left-0 flex justify-between items-center bg-orange-200 w-full'>
                            <input type='text' className='bg-slate-200 rounded-full p-1 md:w-[500px] focus:bg-white'
                                placeholder='What do you want to say?'>
                            </input>

                            <div className='flex justify-around items-center w-1/3'>
                                <label htmlFor='file_upload'>
                                    <input type='file' id='file_upload' className='hidden' onChange={() => uploadImage()}></input>
                                    <PaperClipIcon className='h-6 fill-orange-200' />
                                </label>

                                <button type='button' className='flex flex-col items-center border border-orange-200 
                                    rounded-full w-[75px] hover:bg-amber-100' 
                                    onClick={() => sendMessage()}>
                                    <PaperAirplaneIcon className='h-6 fill-orange-200' />
                                </button>
                            </div>                            
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ActiveChat;
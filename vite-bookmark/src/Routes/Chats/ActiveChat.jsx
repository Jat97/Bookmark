import {useState} from 'react';
import {PaperClipIcon, PaperAirplaneIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useBookStore} from '../../Context/bookStore';
import {useSendMessageMutation} from '../Functions/Mutations/ChatMutations';
import Message from './Message';

const ActiveChat = (props) => {
    const chat = props.props;

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

    return (
        <div>
            <div className='flex flex-col items-center'>
                {`${chat.user_2.first_name} ${chat.user_2.last_name}`}
            </div>

            {chat.messages.map(message => {
                return <Message props={message} />
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

                <div>
                    <input type='text' className='bg-slate-200 max-w-20 rounded-full md:max-w-28 focus:bg-white'
                        placeholder='What do you want to say?'>
                    </input>

                    <label>
                        <input type='file' id='file_upload' className='hidden' onChange={() => uploadImage()}></input>
                        <PaperClipIcon className='h-6 fill-orange-200' />
                    </label>

                    <button type='button' className='border border-orange-200 rounded-full hover:bg-amber-100' 
                        onClick={() => sendMessage()}>
                        <PaperAirplaneIcon className='h-6 fill-orange-200' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ActiveChat;
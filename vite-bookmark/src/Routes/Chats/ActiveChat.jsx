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
            <div>
                {`${chat.user_2.first_name} ${chat.user_2.last_name}`}
            </div>

            {chat.messages.map(message => {
                return <Message props={message} />
            })}

            <div>
                {image.reader &&
                    <div>
                        <XMarkIcon className='h-6' onClick={() => removeImage()}/>
                       <img src={image.reader}></img> 
                    </div>   
                }

                <div>
                    <label>
                        <input type='file' id='file_upload' className='hidden' onChange={() => uploadImage()}></input>
                        <PaperClipIcon className='h-6' />
                    </label>

                    <input type='text'></input>

                    <button type='button' onClick={() => sendMessage()}>
                        <PaperAirplaneIcon className='h-6' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ActiveChat;
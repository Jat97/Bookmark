import {useState} from 'react';
import {PaperClipIcon, PaperAirplaneIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {useSendMessageMutation} from '../Functions/Mutations/ChatMutations';
import Message from './Message';

const ActiveChat = (props) => {
    const chat = props.props;

    const [image, setImage] = useState({file: null, reader: null});

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

                <label>
                    <input type='file' id='file_upload' className='hidden' onChange={() => uploadImage()}></input>
                    <PaperClipIcon className='h-6' />
                </label>

                <button type='button'>
                    <PaperAirplaneIcon className='h-6' />
                </button>
            </div>
        </div>
    )
}

export default ActiveChat;
import {useBookStore} from '../../Context/bookStore';
import {XMarkIcon} from '@heroicons/react/24/solid';
import UserDisplay from '../Users/UserDisplay';
import ActiveChat from './ActiveChat';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const ChatBox = (props) => {
    const chats = props.props;

    const selected_chat = useBookStore((state) => state.selected_chat);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);

    const changeActiveChat = (e) => {
        chats.forEach(chat => {
            if(chat.chat.user_2.id === e.target.id) {
                setSelectedChat(chat.chat);
            }
        });
    }

    const disableChat = () => {
        setSelectedChat(null);
    }
 
    return (
        <div className='absolute bottom-0 right-2 grid grid-cols-2 border border-slate-200 shadow-sm 
            shadow-slate-200 max-h-screen max-w-screen md:max-h-48 md:max-w-32'>
                
            <XMarkIcon className='h-6 fill-slate-200 hover:fill-zinc-100' onClick={() => disableChat()} />

            <div className='flex flex-col items-start'>
                {chats.map(chat => {
                    return (
                        <div onClick={() => changeActiveChat()}>
                            <UserDisplay props={[chat.user_2, 'chat']} />

                            <div className='flex justify-around items-center'>
                                <p className='text-sm'> {chat.messages[chat.messages.length - 1].text} </p>
                                <p className='text-xs text-slate-200'> 
                                    {dayjs.to(chat.messages[chat.messages.length - 1].sent)} 
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {selected_chat && 
                <ActiveChat props={selected_chat} />
            }
        </div>
    )
}

export default ChatBox;
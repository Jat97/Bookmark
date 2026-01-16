import {useBookStore} from '../../Context/bookStore';
import {XMarkIcon} from '@heroicons/react/24/solid';
import ActiveChat from './ActiveChat';
import ProfileDisplay from '../Profiles/ProfileInformation/ProfileDisplay';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const ChatBox = ({chats}) => {
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
        <div className='fixed bottom-0 right-2 grid grid-cols-2 border border-slate-200 rounded-tr-xl rounded-tl-xl 
            bg-white shadow-sm shadow-slate-200 h-screen w-screen md:h-[300px] md:w-[500px]'>
                
            <XMarkIcon className='absolute right-0 fill-slate-200 h-6 hover:fill-zinc-100' onClick={() => disableChat()} />

            <div className='flex flex-col items-start'>
                {chats?.map(chat => {
                    return (
                        <div onClick={() => changeActiveChat()}>
                            <ProfileDisplay profile={chat.user_2} is_logged={false} profile_mode={'mode'} />

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
                <ActiveChat chat={selected_chat} />
            }
        </div>
    )
}

export default ChatBox;
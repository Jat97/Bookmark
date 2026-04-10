import {useEffect, useMemo} from 'react';
import {ChatBubbleLeftEllipsisIcon, TrashIcon} from '@heroicons/react/24/solid';
import {useFetchLogged} from '../Functions/Queries/UserQueries';
import {useFetchChats} from '../Functions/Queries/ChatQueries';
import {useDeleteChatMutation} from '../Functions/Mutations/ChatMutations';
import {useBookStore} from '../../Context/bookStore';
import ActiveChat from './ActiveChat';
import ProfileDisplay from '../Profiles/ProfileInformation/Accounts/ProfileDisplay';
import PageHeader from '../Miscellaneous/Text/PageHeader';
import NoItems from '../Miscellaneous/Text/NoItems';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const ChatBox = () => {
    const mobileView = useBookStore((state) => state.mobileView);
    const selected_chat = useBookStore((state) => state.selected_chat);
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSelectedChat = useBookStore((state) => state.setSelectedChat);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const chatData = useFetchChats([authorized, setAuthorized, setSiteError]);
    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);

    const delete_chat_mutation = useDeleteChatMutation(setSiteError);

    useEffect(() => {
        if(!selected_chat && !mobileView) {
            setSelectedChat(chatData.data?.chats[0]);
        }
    }, [selected_chat, mobileView, chatData]);

    const unreadMessages = useMemo(() => {
        if(chatData.data?.chats?.length === 0) {
            return 0;
        }
        else {
            return chatData.data?.chats.reduce((unread, chat) => {
                return (
                    unread + chat.messages.filter(message => !message.checked 
                        && message.sending_user !== loggedData?.data?.profile.id
                    ).length
                )
            }, 0);
        }        
    }, [chatData.data?.chats]);

    const changeActiveChat = (e) => {
        chatData.data.chats.forEach(chat => {
            if(chat.chat.user.id.toString() === e.currentTarget.id) {
                setSelectedChat(chat);
            }
        });
    }

    const deleteChat = (e) => {
        return delete_chat_mutation.mutate(e.currentTarget.id);
    }

    if(chatData.data?.chats.length === 0) {
        return (
            <div className='flex flex-col items-center m-40'>
                <ChatBubbleLeftEllipsisIcon className='h-20 fill-slate-200 md:h-32' />

                <NoItems text={`You don't seem to have any chats!`} />
            </div>
        )
    }
    else {
        return (
            <div className='flex flex-col items-start gap-y-10'>
                {unreadMessages > 0 &&
                    <PageHeader props={`${unreadMessages} new messages`} />
                }

                <div className='flex flex-col items-start md:flex-row md:justify-start md:w-full'>
                    <ul className='flex flex-col items-start w-screen border-b border-solid 
                        md:border-r md:border-slate-200 md:overflow-x-hidden md:overflow-y-auto md:h-screen md:w-1/3'>
                        {chatData.data?.chats.map(chat => {
                            return (
                                <li id={chat.chat?.user.id} className={`relative flex flex-col items-start m-2 w-full 
                                        md:gap-y-2 md:p-1 md:w-[250px]
                                    ${chat.chat?.user.id === selected_chat?.user?.id && 'bg-stone-200/50'}`} 
                                    onClick={(e) => changeActiveChat(e)}>
                                    <ProfileDisplay profile={chat.chat?.user} is_logged={false} profile_mode={'chat'} />

                                    <div className='flex justify-between w-full md:items-stretch'>
                                        <span className='text-base truncate md:text-sm'> 
                                            {chat.messages[chat.messages.length - 1].text} 
                                        </span>

                                        <span className='text-sm text-slate-200 md:text-xs'> 
                                            {dayjs().to(chat.messages[chat.messages.length -1].sent)} 
                                        </span>
                                    </div>

                                    <div id={chat.chat.id} className='group absolute top-[10px] right-0'
                                        onClick={(e) => deleteChat(e)}>
                                        <TrashIcon className='invisible h-5 fill-slate-200 group-hover:visible' />
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                    
                    <div>        
                        {selected_chat && 
                            <ActiveChat chat={selected_chat} />
                        }
                    </div>
                </div>
            </div>
        )
    }    
}

export default ChatBox;
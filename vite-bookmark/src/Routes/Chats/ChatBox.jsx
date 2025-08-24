import {bookStore} from '../../Context/bookStore';
import UserDisplay from '../Users/UserDisplay';
import ActiveChat from './ActiveChat';
import dayjs from 'dayjs';
import relativeTime from '/dayjs/plugins/relativeTime';
dayjs.extend(relativeTime);

const ChatBox = (props) => {
    const chats = props.props;

    const selected_chat = bookStore((state) => state.selected_chat);
    const setSelectedChat = bookStore((state) => state.setSelectedChat);

    const changeActiveChat = (e) => {
        chats.forEach(chat => {
            if(chat.chat.user_2.id === e.target.id) {
                setSelectedChat(chat.chat);
            }
        });
    }
 
    return (
        <div>
            <div>
                {chats.map(chat => {
                    return (
                        <div onClick={() => changeActiveChat()}>
                            <UserDisplay props={[chat.user_2, '']} />

                            <div>
                                <p> {chat.messages[chat.messages.length - 1].text} </p>
                                <p> {dayjs.to(chat.messages[chat.messages.length - 1].sent)} </p>
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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Message = ({message, chat, is_logged}) => {
    return (
        <div className={`flex flex-col w-full p-1 ${is_logged ? 'items-end' : 'items-start'}`}>
            {message.image &&
                <img src={message.image} className='w-[150px]'></img>
            }

            <div className={`word-break rounded-tl-md rounded-tr-md w-fit
                ${is_logged ? 'rounded-br-xs rounded-bl-md bg-amber-400' : 'rounded-br-md rounded-bl-xs bg-stone-400'}
                ${message.text && 'p-1' }`}>
                <p> {message.text} </p>
            </div>

            {message.sent === chat.last_message_sent && 
                <p className='text-xs text-slate-200'> {dayjs().to(message.sent)} </p>
            }
        </div>
    )
}

export default Message;
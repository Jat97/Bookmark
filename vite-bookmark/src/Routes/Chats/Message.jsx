import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const Message = ({message, is_logged}) => {
    return (
        <div className={`flex flex-col ${is_logged ? 'items-start' : 'items-end'}`}>
            {message.image &&
                <img src={message.image}></img>
            }

            <div className={`rounded-tl-xs rounded-tr-xs 
                ${is_logged ? 'rounded-br-xl rounded-bl-xs bg-amber-400' : 'rounded-br-xs rounded-bl-xl'}`}>
                <p> {message.text} </p>
            </div>

            <p className='text-xs text-slate-200'> {dayjs.to(message.sent)} </p>
        </div>
    )
}

export default Message;
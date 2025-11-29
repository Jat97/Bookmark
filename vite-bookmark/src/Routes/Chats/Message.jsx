import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugins/relativeTime';
dayjs.extend(relativeTime);

const Message = (props) => {
    const message = props.props[0];
    const is_logged = props.props[1];

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
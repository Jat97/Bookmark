import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugins/relativeTime';
dayjs.extend(relativeTime);

const Message = (props) => {
    const message = props.props[0];
    const is_logged = props.props[1];

    return (
        <div>
            {message.image ?
                <img src={message.image}></img>
            :
                null
            }

            <div>
                <p> {message.text} </p>
            </div>

            <p> {dayjs.to(message.sent)} </p>
        </div>
    )
}

export default Message;
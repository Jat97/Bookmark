const NotificationCount = (props) => {
    const count = props.props;

    return (
        <div className={`${count > 0 ? 'font-semibold bg-red-400 text-white rounded-full w-1' : 'hidden'}`}> {count} </div>
    )
};

export default NotificationCount;
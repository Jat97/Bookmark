const NotificationCount = ({count}) => {
    return (
        <div className={`${count > 0 ? 'absolute top-[5px] left-[20px] font-semibold bg-red-400 text-white rounded-full w-[10px]' : 'hidden'}`}> 
            {count} 
        </div>
    )
};

export default NotificationCount;
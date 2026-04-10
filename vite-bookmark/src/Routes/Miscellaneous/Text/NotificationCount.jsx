const NotificationCount = ({count}) => {
    return (
        <div className={`${count > 0 ? `absolute text-center top-[20px] left-[110px] font-semibold bg-red-500/50 text-white 
            rounded-full w-[20px] md:top-[5px] md:left-[20px]` : 'hidden'}`}> 
            {count} 
        </div>
    )
};

export default NotificationCount;
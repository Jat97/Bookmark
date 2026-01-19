const LogSignButton = ({log_sign_text, log_sign_fn}) => {
    return (
        <button type='button' className='text-white font-semibold cursor-pointer bg-sky-400 rounded-full p-1 w-[150px] 
            hover:bg-cyan-100' 
            onClick={log_sign_fn}>
            {log_sign_text}
        </button>
    )
}

export default LogSignButton;
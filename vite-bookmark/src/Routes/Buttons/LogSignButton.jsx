const LogSignButton = (props) => {
    const log_sign_text = props.props[0];
    const log_sign_fn = props.props[1];

    return (
        <button type='button' className='text-white bg-sky-400 rounded-full w-[100px] hover:bg-cyan-100' 
            onClick={log_sign_fn}>
            {log_sign_text}
        </button>
    )
}

export default LogSignButton;
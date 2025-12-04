const LogSignInput = (props) => {
    const id = props.props;

    return (
        <input data-testid={id} name={id} type={id === 'password' || id === 'confirm' ? 'password' : id === 'email' ? 'email' : 'text'}
            className='bg-gray-200 rounded-full p-1 w-[200px] focus:bg-white' 
            minLength={id === 'password' || id === 'confirm' ? '8' : '1'} 
            maxLength={id === 'password' || id === 'confirm' ? '8' : '1'}
            placeholder={`${id.replace(id[0], id[0].toUpperCase())}`}>
        </input>
    )
}

export default LogSignInput;
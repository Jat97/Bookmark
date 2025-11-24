const LogSignInput = (props) => {
    const id = props.props;

    return (
        <input data-testid={id} name={id} type={id === 'password' || id === 'confirm' ? 'password' : id === 'email' ? 'email' : 'text'}
            className='bg-gray-200 p-1 max-w-12 focus:bg-white' 
            minLength={id === 'password' || id === 'confirm' ? '8' : '1'} 
            maxLength={id === 'password' || id === 'confirm' ? '8' : '1'}
            placeholder='Enter information here...'>
        </input>
    )
}

export default LogSignInput;
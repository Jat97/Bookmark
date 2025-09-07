const LogSignInput = (props) => {
    const id = props.props;

    return (
        <input name={id} type={id === 'password' || id === 'confirm' ? 'password' : id === 'email' ? 'email' : 'text'}
            minLength={id === 'password' || id === 'confirm' ? '8' : '1'} 
            maxLength={id === 'password' || id === 'confirm' ? '8' : '1'}>
        </input>
    )
}

export default LogSignInput;
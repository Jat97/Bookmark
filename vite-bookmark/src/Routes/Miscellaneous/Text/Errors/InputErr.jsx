const InputErr = (props) => {
    const err = props.props;

    return (
        <p className='text-sm text-red-500'> {err} </p>
    )
}

export default InputErr;
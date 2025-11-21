const AcceptButton = (props) => {
    const id = props.props[0];
    const accept_fn = props.props[1];

    return (
        <button id='accept' data-testid={`accept-${id}`} className='bg-green-200 hover:bg-lime-100' 
            onClick={accept_fn}>
            Accept
        </button>
    )
};

export default AcceptButton;
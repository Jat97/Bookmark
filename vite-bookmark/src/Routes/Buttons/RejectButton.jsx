const RejectButton = (props) => {
    const id = props.props[0];
    const reject_fn = props.props[1];

    return (
        <button id='reject' data-testid={`reject-${id}`} className='bg-red-200 cursor-pointer hover:bg-pink-100'
            onClick={reject_fn}>
            Reject
        </button>
    )
}

export default RejectButton;
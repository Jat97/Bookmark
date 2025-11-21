const PageHeader = (props) => {
    const header = props.props;

    return (
        <p className='text-xl font-semibold'> {header} </p>
    )
}

export default PageHeader;
const PageHeader = (props) => {
    const header = props.props;

    return (
        <p className='text-center text-sm font-semibold md:text-xl'> {header} </p>
    )
}

export default PageHeader;
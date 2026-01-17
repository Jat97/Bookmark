const DescriptionBox = ({description, editDescription, is_user}) => {
    return (
        <label htmlFor='description' className='flex flex-col items-start'>
            <span className='font-semibold'> Description </span>

            <textarea id='description' cols='50' rows='10' className='bg-slate-200'
                placeholder={`${is_user ? 'How would you describe yourself?' : 'What is the purpose of this group?'}`} 
                {...(editDescription && {value: description, onChange: editDescription})}>
            </textarea>
        </label> 
    )
}

export default DescriptionBox;
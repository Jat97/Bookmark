const UserGroupInput = ({id, input_value, input_fn}) => {
    return (
        <input data-testid={id} id={id} name={id} 
            type={id === 'password' || id === 'confirm_password' ? 'password' : id === 'email' ? 'email' :
                id === 'dob' ? 'date' : 'text'}
            className={`bg-gray-200 rounded-full p-1 focus:bg-white ${id === 'title' ? 'w-[225px]' : 'w-[175px]'}`} 
            minLength={id === 'password' || id === 'confirm_password' ? '8' : '1'} 
            maxLength={id === 'password' || id === 'confirm_password' ? '15' : '30'}
            placeholder={`${id.replace('_', ' ').replace(id[0], id[0].toUpperCase())}`}
            {...(input_fn ? {value: input_value, onChange: input_fn} : {defaultValue: input_value})}>
        </input>
    )
}

export default UserGroupInput;
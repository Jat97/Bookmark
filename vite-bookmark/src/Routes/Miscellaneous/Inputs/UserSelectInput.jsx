const UserSelectInput = ({value, select_fn}) => {
    return (
        <select id='role' className='border-solid border-slate-200 bg-slate-200 rounded-2xl p-1 w-[150px]' 
            {...(select_fn && {value: value, onChange: select_fn})}>
            <option value='Default'> Select a role </option>
            <option value='Reader'> Reader </option>
            <option value='Essayist'> Essayist </option>
            <option value='Poet'> Poet </option>
            <option value='Novelist'> Novelist </option>
            <option value='Critic'> Critic </option> 
        </select>
    )
};

export default UserSelectInput;
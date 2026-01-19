const ToggleSwitch = ({status, toggle_fn}) => {
    return (
        <button className={`flex justify-between items-center border-solid border-slate-200 
            rounded-3xl w-[50px]
            ${status ? 'bg-pink-300' : 'bg-slate-200'}`} onClick={toggle_fn}>
            <span className={`${!status && `border border-solid border-slate-200 shadow-sm 
                shadow-slate-200 rounded-3xl bg-white p-2 w-[25px]`}`}>
            </span>

            <span className={`${status && `border border-solid border-slate-200 shadow-sm 
                shadow-slate-200 rounded-3xl bg-white p-2 w-[25px]`}`}>
            </span>
        </button>
    )
}

export default ToggleSwitch
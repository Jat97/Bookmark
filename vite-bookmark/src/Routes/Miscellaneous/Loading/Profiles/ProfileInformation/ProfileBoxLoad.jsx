const ProfileBoxLoad = () => {
    let box_arr = [0, 1, 2];

    return (
        <div className='hidden md:flex md:flex-col md:items-end md:gap-y-8 md:m-5'>
            <div className='flex flex-col items-center gap-y-5 border border-slate-400 w-[250px]'>
                <div className='flex flex-col items-center bg-amber-300/50 p-2 w-full'>
                    <span className='bg-slate-400 p-1 w-[150px]'></span>
                </div>
                
                {box_arr.map(arr => {
                    return (
                        <div key={arr} className="flex justify-center items-center gap-x-5 w-full">
                            <span className='bg-slate-400 rounded-full p-5 w-[10px]'></span>
                            <span className='bg-slate-400 p-2 w-[150px]'></span>
                        </div>  
                    )
                })}
            </div>

             <div className='flex flex-col items-center gap-y-5 border border-slate-400 w-[250px]'>
                <div className='flex flex-col items-center bg-amber-300/50 p-2 w-full'>
                    <span className='bg-slate-400 p-1 w-[150px]'></span>
                </div>
                

                {box_arr.map(arr => {
                    return (
                        <div key={arr} className="flex justify-center items-center gap-x-5 w-full">
                            <span className='bg-slate-400 rounded-full p-5 w-[10px]'></span>
                            <span className='bg-slate-400 p-2 w-[150px]'></span>
                        </div>  
                    )
                })}
            </div>
        </div>
    )
}

export default ProfileBoxLoad;
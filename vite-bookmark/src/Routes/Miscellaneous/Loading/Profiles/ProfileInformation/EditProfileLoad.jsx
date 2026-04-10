const EditProfileLoad = () => {
    let edit_arr;
    edit_arr.length = 6;

    return (
        <div className='animate-pulse'>
            <span className='bg-slate-400/50 p-1 w-[45px]'></span>

            <div className='flex justify-around items-center'>
                <div className='flex flex-col items-start gap-y-2'>
                  <span className='bg-slate-400/50 p-1 w-[50px]'></span>
                  <span className='bg-slate-400/50 p-1 w-[35px]'></span>   
                </div>
                
                <span className-='bg-slate-400/50 p-2 w-[20px]'></span>
            </div>

            <div className='grid grid-cols-2 items-center'>
                {edit_arr.map(arr => {
                    return (
                        <div key={arr} className='flex flex-col items-start'>
                            <span className='bg-slate-400/50 p-1 w-[35px]'></span>
                            <span className='bg-slate-400/50 p-2 w-[50px]'></span>
                        </div>
                    )
                })}
            </div>

            <div>
                <span className='bg-slate-400/50 p-1 w-[45px]'></span>

                <div>
                    {edit_arr.slice(0, 3).map(arr => {
                        return (
                            <div key={arr} className='flex justify-around items-center'>
                                <div className='flex justify-start items-center gap-x-5'>
                                    <span className='bg-slate-400/50 rounded-full p-5 w-[30px]'></span>
                                    <span className='bg-slate-400/50 p-1 w-[50px]'></span>
                                </div>

                                <div>
                                    <span className='bg-slate-400/50 rounded-full p-2 w-[75px]'></span>
                                    <span className='bg-slate-400/50 rounded-full p-2 w-[75px]'></span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <span className='bg-slate-400/50 p-2 w-[75px]'></span>
        </div>
    )
}

export default EditProfileLoad;
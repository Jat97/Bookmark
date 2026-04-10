const IndexLoad = () => {
    const index_arr = [0, 1, 2, 3, 4];

    return (
        <div className='flex flex-col items-center gap-y-5'>
            {index_arr.map(arr => {
                return (
                    <div key={arr} className='flex justify-around items-center gap-x-5 w-full'>
                        <div className='flex justify-around items-center gap-x-5'>
                            <span className='bg-slate-400 rounded-full p-6 w-[30px]'></span>
                            <span className='bg-slate-400 p-1 w-[100px]'></span>
                        </div>

                        <div className='flex justify-around items-center gap-x-5'>
                            <span className='bg-slate-400 rounded-full p-3 w-[100px]'></span>
                            <span className='bg-slate-400 rounded-full p-3 w-[100px]'></span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
};

export default IndexLoad;
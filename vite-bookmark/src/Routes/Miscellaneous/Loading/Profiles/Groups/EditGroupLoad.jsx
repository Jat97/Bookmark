import ProfileBoxLoad from '../ProfileInformation/ProfileBoxLoad';

const EditGroupLoad = () => {
    const edit_group_arr = [0, 1, 2];

    return (
        <div className='animate-pulse flex justify-between items-start'>
            <div className='flex flex-col items-start gap-y-10 m-2'>
                <span className='bg-slate-400 p-2 w-[200px]'></span>

                <div className='flex flex-col items-center gap-y-2'>
                    <span className='bg-slate-400 p-40 w-[100px]'></span>
                    <span className='bg-slate-400 p-2 w-[100px]'></span>
                </div>

                <div className='flex flex-col gap-y-10'>
                    <div className='flex justify-between items-center w-full'>
                        <span className='bg-slate-400 p-2 w-[200px]'></span>
                        <span className='bg-slate-400 rounded-full p-3 w-[50px]'></span>
                    </div>

                    <div className='flex flex-col gap-y-4'>
                        <span className='bg-slate-400 p-2 w-[100px]'></span>
                        <span className='bg-slate-400 rounded-full p-2 w-[200px]'></span>
                    </div>
                    
                    <span className='bg-slate-400 p-40 w-[100px]'></span>
                </div>

                <div className='flex flex-col gap-y-4'>
                    <span className='bg-slate-400 p-40 w-[100px]'></span>

                    {edit_group_arr.map(arr => {
                        return (
                            <div key={arr} className='flex justify-around items-center gap-5'>
                                <span className='bg-slate-400 rounded-full p-7 w-[50px]'></span>
                                <span className='bg-slate-400 p-2 w-[150px]'></span>
                            </div>
                        )
                    })}
                </div>

                <div className='flex justify-around items-center gap-x-10'>
                    <span className='bg-slate-400 rounded-full p-3 w-[150px]'></span>
                    <span className='bg-slate-400 rounded-full p-3 w-[150px]'></span>
                </div>
            </div>

            <ProfileBoxLoad />
        </div>
    )
}

export default EditGroupLoad;
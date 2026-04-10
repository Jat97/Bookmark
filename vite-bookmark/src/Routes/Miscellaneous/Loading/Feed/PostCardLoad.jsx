const PostCardLoad = (key) => {
    return (
        <div key={key} className='flex flex-col items-start gap-y-10 border border-slate-400 w-screen md:w-3/4'>
            <div className='flex justify-around items-center gap-x-5'>
                <span className='bg-slate-400 rounded-full p-8 w-[40px]'></span>
                <span className='bg-slate-400 p-2 w-[150px]'></span> 
            </div>

            <div className='flex flex-col gap-y-5'>
                <span className='bg-slate-400 p-2 w-[450px]'></span>
                <span className='bg-slate-400 p-2 w-[450px]'></span>
                <span className='bg-slate-400 p-2 w-[450px]'></span>
            </div>

            <span className='bg-slate-400 p-5 w-full'></span>
        </div>
    )
}

export default PostCardLoad;
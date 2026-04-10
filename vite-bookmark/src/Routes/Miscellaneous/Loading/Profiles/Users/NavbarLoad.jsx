const NavbarLoad = () => {
    return (
        <div className='animate-pulse flex justify-evenly items-center bg-amber-300/50 p-2 w-screen'>
            <span className='bg-slate-400 p-2 w-[75px]'></span>

            <span className='bg-slate-400 p-4 w-[300px]'></span>

            <div className='flex justify-around items-center md:w-[250px]'>
                <span className='bg-slate-400 p-3 w-1'></span>
                <span className='bg-slate-400 p-3 w-1'></span>
                <span className='bg-slate-400 p-3 w-1'></span>
            </div>

            <div className='flex justify-start items-center gap-x-5'>
                <span className='bg-slate-400 rounded-full p-6'></span>
                <span className='bg-slate-400 p-2 w-[100px]'></span>
            </div>
        </div>
    )
}

export default NavbarLoad;
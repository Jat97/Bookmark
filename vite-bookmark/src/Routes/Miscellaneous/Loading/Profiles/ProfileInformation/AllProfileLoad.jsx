import IndexLoad from './IndexLoad'; 
import ProfileBoxLoad from './ProfileBoxLoad';

const AllProfileLoad = () => {
    return (
        <div className='animate-pulse flex flex-col items-center'>
            <span className='bg-slate-400 m-2 p-3 w-[250px]'></span>

            <div className='flex grid grid-cols-2 items-center w-full'>
                <IndexLoad />

                <ProfileBoxLoad />        
            </div>
        </div>
    )
}

export default AllProfileLoad;
import ProfileBoxLoad from './ProfileBoxLoad';
import PostCardLoad from '../../Feed/PostCardLoad';

const ProfilePageLoad = () => {
    let profile_arr = [0, 1, 2];

    return (
        <div className='animate-pulse grid grid-cols-3 justify-between w-full'>
            <div className='flex flex-col items-start gap-y-5 border-r-2 border-slate-200 border-solid md:w-[200px]'>
                <div className='flex flex-col gap-y-5'>
                    <span className='bg-slate-400 rounded-full p-20 w-[40px]'></span>
                    <span className='bg-slate-400 p-3 w-[150px]'></span>
                </div>

                <div className='flex flex-col items-center gap-y-5'>
                    <span className='bg-slate-400 rounded-full p-3 w-[100px]'></span>
                    <span className='bg-slate-400 rounded-full p-3 w-[100px]'></span>
                    <span className='bg-slate-400 p-2 w-[100px]'></span>
                </div>
            </div>

            <div className='flex flex-col items-start gap-y-5 m-5 w-[650px]'>
                {profile_arr.map(arr => {
                    return <PostCardLoad key={arr} />
                })}
            </div>
           
           <ProfileBoxLoad />
        </div>
    )
}

export default ProfilePageLoad;
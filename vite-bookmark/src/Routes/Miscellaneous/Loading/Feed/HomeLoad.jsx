import PostCardLoad from './PostCardLoad';
import ProfileBoxLoad from '../Profiles/ProfileInformation/ProfileBoxLoad';

const HomeLoad = () => {
    let home_arr = [0, 1, 2, 3, 4];

    return (
        <div className='animate-pulse flex flex-col items-center m-2 w-full md:grid md:grid-cols-2 md:items-start'>
            <div className='flex flex-col items-center gap-y-5 w-full'>
                <span className='bg-slate-400 p-52 w-[50px]'></span>

                {home_arr.map(arr => {
                    return (
                        <PostCardLoad key={arr} />
                    )
                })}
            </div>

            <ProfileBoxLoad />
        </div>
    )
}

export default HomeLoad;
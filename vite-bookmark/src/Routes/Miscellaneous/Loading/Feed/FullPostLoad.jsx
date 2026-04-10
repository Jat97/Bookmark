import PostCardLoad from "./PostCardLoad";
import ProfileBoxLoad from '../Profiles/ProfileInformation/ProfileBoxLoad';

const FullPostLoad = () => {
    const comment_arr = [0, 1, 2, 3, 4];

    return (
        <div className='animate-pulse grid grid-cols-2 m-2'>
            <div className='flex flex-col items-start gap-y-5'>
                <PostCardLoad key={1} />

                <div className='flex flex-col items-start gap-y-5 w-full'>
                    {comment_arr.map(arr => {
                        return (
                            <PostCardLoad key={arr} />
                        )
                    })}
                </div>
            </div>
            
            <ProfileBoxLoad />
        </div>
    )
}

export default FullPostLoad;
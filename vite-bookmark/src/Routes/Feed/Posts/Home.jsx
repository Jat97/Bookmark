import {useFetchLogged, useFetchFriends} from '../../Functions/Queries/UserQueries';
import {useFetchPosts}  from "../../Functions/Queries/PostQueries";
import {useBookStore} from '../../../Context/bookStore';
import PostCard from './PostCard';
import TextBox from '../../Miscellaneous/Inputs/TextBox';
import NoItems from '../../Miscellaneous/Text/NoItems';
import ProfileDisplay from '../../Profiles/ProfileInformation/ProfileDisplay';

const Home = () => {
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const friendData = useFetchFriends([authorized, setAuthorized, setSiteError]);
    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);

    const currently_online = friendData.data?.friends?.filter(friend => friend.online);

    return (
        <div> 
            <div className='flex flex-col items-center md:flex-row md:justify-between'>
                <div className='flex flex-col items-center gap-2 m-4 md:w-2/5'>
                    <TextBox postid={null} poster={loggedData.data?.logged_user.profile} cancelFn={null} />

                    {postData.data?.posts.map(post => {
                        return <PostCard post={post} />
                    })}
                </div>            
                
                <div className='hidden md:inline md:sticky md:flex md:flex-col md:items-center md:w-1/5'>
                    <div className='flex flex-col items-center bg-orange-400 md:w-full'>
                        <p className='font-semibold'> Who's online? </p>

                        {currently_online?.length === 0 ?
                            <NoItems text={'No users online.'} />
                        :
                            currently_online?.map(friend => {
                                return <ProfileDisplay profile={friend} is_logged={false} profile_mode={'index'} />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;
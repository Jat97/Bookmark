import {useFetchLogged, useFetchUsers} from '../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useFetchPosts}  from '../../Functions/Queries/PostQueries';
import {useBookStore} from '../../../Context/bookStore';
import PostCard from './PostCard';
import ProfileBox from '../../Profiles/ProfileInformation/Accounts/ProfileBox';
import TextBox from '../../Miscellaneous/Inputs/TextBox';
import NoItems from '../../Miscellaneous/Text/NoItems';
import HomeLoad from '../../Miscellaneous/Loading/Feed/HomeLoad';

const Home = () => {
    const is_guest = useBookStore((state) => state.is_guest);
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);
    
    const loggedData = !is_guest && useFetchLogged([authorized, setAuthorized, setSiteError]);
    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const currently_online = !is_guest && loggedData.data?.friends.filter(friend => friend.online);
    const user_groups = groupData.data?.groups.filter(group => 
        group.memberships?.some((member) => member.id === loggedData.data?.profile.id)
        || group.moderator.id === loggedData.data?.profile.id
    );

    if(postData.isPending) {
        return <HomeLoad />
    }
    else {
        return (
            <div className='relative flex flex-col items-center md:flex-row md:justify-between'>
                <div className='flex flex-col items-center gap-5 m-4 md:w-1/2'>
                    <TextBox post={null} poster={loggedData.data?.profile} for_comment={false} cancelFn={null} />

                    {postData.data?.posts.length === 0 ?
                        <NoItems text={`Your feed is empty. Why not make a post?`} />
                    :
                        postData.data?.posts?.map(post => {
                            return <PostCard 
                                post={post} 
                                logged={loggedData.data?.profile.id} 
                            />
                        }) 
                    }
                </div>    
                
                <div className='hidden md:fixed md:top-[150px] md:right-[10px] md:flex md:flex-col md:gap-y-5'>
                    <ProfileBox 
                        title={`Who's online?`} 
                        profile={!is_guest && loggedData.data.profile.id}
                        items={is_guest ? userData.data?.users : currently_online}
                    />

                    <ProfileBox 
                        title={'Groups'}
                        profile={!is_guest && loggedData.data.profile.id}
                        items={is_guest ? groupData.data?.groups : user_groups}
                    />
                </div>    
            </div>
        )
    }
};

export default Home;
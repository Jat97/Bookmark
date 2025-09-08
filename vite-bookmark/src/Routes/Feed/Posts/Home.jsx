import {useFetchPosts}  from "../../Functions/Queries/PostQueries";
import {useFetchFriends} from '../../Functions/Queries/UserQueries';
import {useBookStore} from '../../../Context/bookStore';
import PostCard from './PostCard';
import TextBox from '../../Miscellaneous/Inputs/TextBox';
import NoItems from '../../Miscellaneous/Text/NoItems';
import UserDisplay from '../../Users/UserDisplay';

const Home = () => {
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const postData = useFetchPosts([authorized, setAuthorized, setSiteError]);
    const friendData = useFetchFriends([authorized, setAuthorized, setSiteError]);

    const currently_online = friendData.data.friends.filter(friend => friend.online);

    return (
        <div>
            <div>
                <div>
                    <TextBox />
                </div>
            
                <div>
                    {postData.data.posts.map(post => {
                        return <PostCard props={post} />
                    })}
                </div>  
            </div>

            <div>
                <div>
                    Who's online?

                    {currently_online.length === 0 ?
                        <NoItems props={`No users online.`} />
                    :
                        currently_online.map(friend => {
                            return <UserDisplay props={friend} />
                        })
                    }
                </div>
            </div>
        </div>
    )
};

export default Home;
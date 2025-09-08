import {useParams} from 'react-router-dom';
import {useFetchLogged, useFetchUsers} from '../Functions/Queries/UserQueries';
import {useFetchPosts} from '../Functions/Queries/PostQueries';
import {useBookStore} from '../../Context/bookStore';
import UserDisplay from './UserDisplay';
import PostCard from '../Posts/PostCard';
import FriendButton from '../Buttons/FriendButton';
import BlockButton from '../Buttons/BlockButton';

const UserPage = () => {
    const {userid} = useParams();
    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);

    const current_user = userData.data.users.find(user => user.id === userid);
    const user_posts = postData.data.posts.filter(post => post.original_poster.id === current_user.id);

    return (
        <div>
            <div>
                <UserDisplay props={[current_user, loggedData.data.logged_user, '']} />

                {current_user.id !== loggedData.data.logged_user.id &&
                    <div>
                        <FriendButton props={current_user} />
                        <BlockButton props={current_user} />
                    </div>
                }
            </div>

            <div>
                {user_posts.map(post => {
                    return <PostCard props={post} />
                })}
            </div>
        </div>
    )
};

export default UserPage;
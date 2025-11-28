import {Link} from 'react-router-dom';
import {useEditPictureMutation} from '../Functions/Mutations/UserMutations';
import {useBookStore} from '../../Context/bookStore';
import {CameraIcon, UserIcon} from '@heroicons/react/24/solid';

const UserDisplay = (props) => {
    const user = props.props[0];
    const logged = props.props[1];
    const user_mode = props.props[2];

    const setSiteError = useBookStore((state) => state.setSiteError);

    const picture_mutation = useEditPictureMutation([user, setSiteError]);

    const editProfilePicture = () => {
        return picture_mutation.mutate();
    }

    const handleUserImageCSS = () => {
        if(user_mode === 'index') {
            return 'max-w-16 md:max-w-20';
        }
        else if(user_mode === 'profile') {
            return 'max-w-20 md:max-w-24';
        }
    }

    const handleUserIconCSS = () => {
        if(user_mode === 'index') {
            return 'max-h-5 md:max-h-6';
        }
        else if(user_mode === 'profile') {
            return 'max-h-8 md:max-h-10'
        }
    }

    return (
        <div>
            <div>
                <div>
                    {user.profile_picture ? 
                        <img src={user.profile_picture} className={`${handleUserImageCSS()}`}></img>
                    :
                        <UserIcon className={`${handleUserIconCSS()}`} />
                    }

                    {user.id === logged.id &&
                        <label onChange={() => editProfilePicture()}>
                            <input type='file' className='hidden'></input>
                            <CameraIcon className='h-6 fill-orange-200' />
                        </label>
                    }
                </div>
                
                <Link to={`/api/profile/${user.id}`} className={`font-semibold 
                    ${user_mode === 'index' ? 'text-blue-600 hover:underline' : 'cursor-not-allowed'}`}> 
                    {`${user.first_name} ${user.last_name}`} 
                </Link>
            </div>
        </div>
    )
};

export default UserDisplay;
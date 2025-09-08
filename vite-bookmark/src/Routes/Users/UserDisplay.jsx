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

    return (
        <div>
            <div>
                <div>
                    {user.profile_picture ? 
                        <img src={user.profile_picture}></img>
                    :
                        <UserIcon className='h-6' />
                    }

                    {user.id === logged.id &&
                        <label onChange={() => editProfilePicture()}>
                            <input type='file' className='hidden'></input>
                            <CameraIcon className='h-6' />
                        </label>
                    }
                </div>
                
                <p> {`${user.first_name} ${user.last_name}`} </p>
            </div>
        </div>
    )
};

export default UserDisplay;
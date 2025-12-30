import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useEditPictureMutation} from '../Functions/Mutations/UserMutations';
import {useBookStore} from '../../Context/bookStore';
import {CameraIcon, UserIcon} from '@heroicons/react/24/solid';

const UserDisplay = (props) => {
    const user = props.props[0];
    const logged = props.props[1];
    const user_mode = props.props[2];

    const [image, setImage] = useState(null);

    const setSiteError = useBookStore((state) => state.setSiteError);

    const picture_mutation = useEditPictureMutation([image, setSiteError]);

    const editProfilePicture = () => {
        setImage(document.querySelector('#profile_picture_picker').files[0]);
        return picture_mutation.mutate();
    }

    const handleIconDivCSS = () => {
        if(user_mode === 'post' || user_mode === 'index') {
            return 'justify-around m-2 md:w-[200px]'
        }
        else if(user_mode === 'search') {
            return 'justify-evenly md:w-[250px]'
        }
        else {
            return 'flex-col gap-1'
        }
    }

    const handleUserImageCSS = () => {
        if(user_mode === 'index') {
            return 'w-[30px] md:w-[45px]';
        }
        else if(user_mode === 'profile') {
            return 'w-[60px] md:w-[100px]';
        }
        else if(user_mode === 'post') {
            return 'w-[40px] md:w-[60px]'
        }
    }

    const handleUserIconCSS = () => {
        if(user_mode === 'index' || user_mode === 'post' || user_mode === 'search') {
            return 'h-6 md:h-8';
        }
        else if(user_mode === 'profile') {
            return 'h-16 md:h-20'
        }
    }

    return (
        <div className={`flex items-center ${handleIconDivCSS()}`}>
            <div className='relative flex flex-col items-center bg-black border border-orange-300 rounded-full p-1'>
                {user?.profile_picture ? 
                    <img src={user?.profile_picture} className={`rounded-full ${handleUserImageCSS()}`}></img>
                :
                    <UserIcon className={`${handleUserIconCSS()}`} />
                }

                {logged && user_mode === 'profile' &&
                    <label onChange={() => editProfilePicture()} 
                        className='absolute right-[-15px] bottom-[-10px] 
                        bg-white border border-orange-600 rounded-full p-1 hover:bg-amber-100'>
                        <input id='profile_picture_picker' type='file' className='hidden'></input>
                        <CameraIcon className='h-6 md:h-7' />
                    </label>
                }
            </div>

            {logged ? 
                <p className='font-semibold'> {`${user?.first_name} ${user?.last_name}`} </p>
            :
                <Link to={`/api/profile/${user?.id}`} className='font-semibold text-sky-400 hover:underline'> 
                    {`${user?.first_name} ${user?.last_name}`} 
                </Link>
            }
        </div>
    )
};

export default UserDisplay;
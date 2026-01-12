import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useBookStore} from '../../../Context/bookStore';
import {useEditPictureMutation} from '../../Functions/Mutations/UserMutations';
import {CameraIcon, UserIcon} from '@heroicons/react/24/solid';

const ProfileDisplay = ({profile, is_logged, profile_mode}) => {
    const [image, setImage] = useState(null);

    const setSiteError = useBookStore((state) => state.setSiteError);

    const profile_picture_mutation = useEditPictureMutation([image, setSiteError]);

    const editProfilePicture = () => {
        setImage(document.querySelector('#profile_picture_picker').files[0]);
        return profile_picture_mutation.mutate();
    }

    const handleIconDivCSS = () => {
        if(profile_mode === 'post' || profile_mode === 'index' || profile_mode === 'navbar') {
            return 'justify-around m-2 md:w-[200px]'
        }
        else if(profile_mode === 'search') {
            return 'justify-evenly md:w-[250px]'
        }
        else {
            return 'flex-col gap-1'
        }
    }

    const handleUserImageCSS = () => {
        if(profile_mode === 'index' || profile_mode === 'navbar') {
            return 'w-[30px] md:w-[45px]';
        }
        else if(profile_mode === 'profile') {
            return 'w-[60px] md:w-[100px]';
        }
        else if(profile_mode === 'post') {
            return 'w-[40px] md:w-[60px]'
        }
    }

    const handleUserIconCSS = () => {
        if(profile_mode === 'index' || profile_mode === 'post' || profile_mode === 'search' 
            || profile_mode === 'navbar') {
            return 'h-6 md:h-8';
        }
        else if(profile_mode === 'profile') {
            return 'h-16 md:h-20'
        }
    }

    return (
        <div className={`flex items-center ${handleIconDivCSS()}`}>
            <div className='relative flex flex-col items-center bg-black border border-orange-300 rounded-full p-1'>
                {profile?.profile_picture || profile?.group_image ? 
                    <img src={profile.profile_picture ? profile?.profile_picture : profile?.group_image} 
                        className={`rounded-full ${handleUserImageCSS()}`}>
                    </img>
                :
                    <UserIcon className={`${handleUserIconCSS()}`} />
                }

                {is_logged && profile_mode === 'profile' &&
                    <label onChange={() => editProfilePicture()} 
                        className='absolute right-[-15px] bottom-[-10px] 
                        bg-white border border-orange-600 rounded-full p-1 hover:bg-amber-100'>
                        <input id='profile_picture_picker' type='file' className='hidden'></input>
                        <CameraIcon className='h-6 md:h-7' />
                    </label>
                }
            </div>

            {profile_mode === 'navbar' ? 
                <p className='font-semibold'> {`${profile?.first_name} ${profile?.last_name}`} </p>
            :
                <Link to={`/api/profile/${profile.id}`} className='font-semibold text-sky-400 hover:underline'>
                    {profile?.title ?
                        profile?.title
                    :
                        `${profile?.first_name} ${profile?.last_name}` 
                    } 
                </Link>
            }
        </div>
    )
}

export default ProfileDisplay;
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useEditPictureMutation} from '../../../Functions/Mutations/UserMutations';
import {BookOpenIcon, CameraIcon, UserIcon} from '@heroicons/react/24/solid';

const ProfileDisplay = ({profile, is_logged, is_guest, profile_mode}) => {
    const [image, setImage] = useState(null);

    const setSiteError = useBookStore((state) => state.setSiteError);

    const profile_picture_mutation = useEditPictureMutation([image, setSiteError]);

    const editProfilePicture = () => {
        setImage(document.querySelector('#profile_picture_picker').files[0]);
        return profile_picture_mutation.mutate({file: image});
    }

    const handleIconDivCSS = () => {
        if(profile_mode === 'profile') {
            return 'flex-col gap-y-2';
        }
        else if(profile_mode === 'navbar') {
            return 'flex-col md:flex-row md:justify-start md:gap-x-2'
        }
        else {
            return 'justify-start gap-x-2';
        }
    }

    const handleUserImageCSS = () => {
        if(profile_mode === 'index') {
            return 'w-[50px] md:w-[40px]';
        }
        else if(profile_mode === 'navbar') {
            return 'w-[30px] md:w-[40px]';
        }
        else if(profile_mode === 'profile') {
            return 'w-[120px] md:w-[150px]';
        }
        else if(profile_mode === 'post') {
            return 'w-[40px] md:w-[60px]'
        }
        else if(profile_mode === 'chat') {
            return 'w-[40px] md:w-[25px]';
        }
        else if(profile_mode === 'box') {
            return 'w-[25px] md:w-[30px]'
        }
        else if(profile_mode === 'alerts') {
            return 'w-[20px] md:w-[15px]' 
        }
    }

    const handleUserIconCSS = () => {
        if(profile_mode === 'index' || profile_mode === 'post' || profile_mode === 'search') {
            return 'h-8';
        }
        else if(profile_mode === 'profile') {
            return 'h-32 md:h-28'
        }
        else if(profile_mode === 'chat') {
            return 'h-9 md:h-6'
        }
        else if (profile_mode === 'box') {
            return 'h-4 md:h-6'
        }
        else if(profile_mode === 'navbar') {
            return 'h-6 md:h-8'
        }
        else if(profile_mode === 'alert') {
            return 'h-3 md:h-5'
        }
    }

    return (
        <div className={`flex items-center m-1 w-[200px] ${handleIconDivCSS()}`}>
            <div className={`relative flex flex-col items-center object-cover object-center bg-black 
                border border-orange-300 p-0.5 max-h-full max-w-full
                    ${profile_mode !== 'profile' && 'rounded-full'}`}>
                {(profile?.profile_picture || profile?.group_image) &&
                    <img src={profile.profile_picture ? profile?.profile_picture : profile?.group_image} 
                        className={`rounded-[50%] ${handleUserImageCSS()}`}>
                    </img>
                }
            
                {((profile?.first_name && !profile.profile_picture) || is_guest) &&
                    <UserIcon className={`${handleUserIconCSS()}`} />
                }

                {(profile?.title && !profile.group_image) &&
                    <BookOpenIcon className={`${handleUserIconCSS()}`} />
                }

                {is_logged && profile_mode === 'profile' &&
                    <label htmlFor='profile_picture_picker' onChange={() => editProfilePicture()} 
                        className='absolute right-[-15px] bottom-[-10px] 
                        bg-white border border-orange-600 rounded-full p-2 hover:bg-amber-100'>
                        <input id='profile_picture_picker' type='file' className='hidden'></input>
                        <CameraIcon className='h-10 md:h-7' />
                    </label>
                }
            </div>

            {profile_mode === 'navbar' || profile_mode === 'chat' ? 
                <p className={`font-semibold ${profile_mode === 'navbar' && 'hidden md:inline'} 
                    ${profile_mode === 'chat' && 'text-base md:text-sm'}`}> 
                    {`${is_guest ? 'Guest' : `${profile?.first_name} ${profile?.last_name}`}`} 
                </p>
            :
                <Link to={`/api/${profile?.title ? 'group' : 'user'}/${profile?.id}`} 
                    className={`font-semibold text-sky-400 hover:underline ${profile_mode === 'alert' && 'text-sm'}`}>
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
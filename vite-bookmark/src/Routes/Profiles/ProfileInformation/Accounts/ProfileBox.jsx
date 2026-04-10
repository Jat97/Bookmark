import {Link} from 'react-router-dom';
import {ChevronRightIcon} from '@heroicons/react/24/solid';
import ProfileDisplay from './ProfileDisplay';
import AcceptButton from '../../../Buttons/Profile/AcceptButton';
import RejectButton from '../../../Buttons/Profile/RejectButton';
import NoItems from '../../../Miscellaneous/Text/NoItems';

const ProfileBox = ({title, profile, items}) => {
    const setBoxURL = () => {
        if(title === 'Requests') {
            return `/api/group/${profile.id}/requests`;
        }
        else {
            return `/api/index/${title.toLowerCase()}`
        }
    }

    return (
        <div className={`flex flex-col items-center gap-y-2 border border-slate-200 shadow-sm shadow-slate-200 mr-5 
            ${title === 'Requests' && items.length > 0 ? 'w-[350px]' : 'w-[250px]'}`}>
            <div className='text-center font-semibold bg-amber-300/50 w-full'>
               <span> {title} </span> 
            </div>

            {items?.length === 0 ?
                <NoItems text={`There's nothing here.`} />
            :
                <ul className='flex flex-col items-center gap-y-3 p-1'>
                    {items?.slice(0, 3).map(item => {
                        return (
                            <li className='flex justify-around items-center'>
                                <ProfileDisplay profile={item} is_logged={false} profile_mode={'box'} />

                                {title === 'Requests' &&
                                    <div className='flex justify-around'>
                                        <AcceptButton user={item} group={profile.title && profile} />

                                        <RejectButton user={item} group={profile.title && profile} />
                                    </div>
                                }
                            </li>
                        )
                    })}
                </ul>
            }

            {items?.length > 3 &&
                <Link to={setBoxURL()}
                    className='flex justify-around items-center text-blue-600 hover:underline'>
                    View all {title.toLowerCase()}
                    <ChevronRightIcon className='stroke-blue-600 h-4' />
                </Link>
            }
        </div>
    )
}

export default ProfileBox;
import {useState} from 'react';
import {useBookStore} from '../../../Context/bookStore';
import {useEditProfileMutation, useToggleHiddenMutation, useDeleteAccountMutation} from '../../Functions/Mutations/UserMutations';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import UserGroupSelect from '../../Miscellaneous/Inputs/UserSelectInput';
import DescriptionBox from '../../Miscellaneous/Inputs/DescriptionBox';
import ProfileDisplay from './ProfileDisplay';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr'
import BlockButton from '../../Buttons/Profile/User/BlockButton';
import ToggleSwitch from '../../Buttons/Profile/ToggleSwitch';
import EditButton from '../../Buttons/Profile/EditButton';
import DeleteButton from '../../Buttons/Profile/DeleteButton';

const EditProfile = () => {
    const setSiteError = useBookStore((state) => state.setSiteError);

    const [editErrors, setEditErrors] = useState({
        first_name: null,
        last_name: null,
        role: null
    });

    const [profileData, setProfileData] = useState({
        first_name: user?.first_name,
        last_name: user?.last_name,
        alma_mater: user?.alma_mater,
        degree: user?.degree,
        role: user?.role,
        description: user?.description
    });

    const profile_mutation = useEditProfileMutation([
        user, 
        profileData, 
        setEditErrors, 
        setSiteError
    ]);

    const hidden_mutation = useToggleHiddenMutation(setSiteError);

    const delete_account_mutation = useDeleteAccountMutation(setSiteError);

    const editProfile = () => {
        profile_mutation.mutate();
    }

    const toggleHiddenStatus = () => {
        hidden_mutation.mutate();
    }

    const editInformation = (e) => {
        setProfileData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }

    const deleteAccount = () => {
        delete_account_mutation.mutate();
    }

    return (
        <div className='flex flex-col items-start gap-3 md:w-2/3'>
            <PageHeader text={'Edit your profile'} />

            <div className='flex justify-between items-center md:w-2/3'>
                <p className='flex flex-col items-start font-semibold'> Hide profile 
                    <span className='text-sm'> Users won't be able to see when you're online. </span> 
                </p>

                <ToggleSwitch status={user?.hidden} toggle_fn={toggleHiddenStatus} />
            </div>

            <div className='grid grid-cols-2 items-center gap-3 md:w-full'>
                <div className='flex flex-col items-start'>
                    <label htmlFor='first_name' className='flex justify-around items-center'>
                        <span className='font-semibold'> First name </span>

                        <UserGroupInput id={'first_name'} input_value={profileData?.first_name} input_fn={editInformation} />
                    </label>

                    {editErrors.first_name && 
                        <InputErr error={editErrors.first_name} />
                    }
                </div> 

                <div className='flex flex-col items-start'>
                    <label htmlFor='last_name'>
                        <span className='font-semibold'> Last name </span>

                        <UserGroupInput id={'last_name'} input_value={profileData?.last_name} input_fn={editInformation} />
                    </label>

                    {editErrors.last_name &&
                        <InputErr error={editErrors.last_name} />
                    }
                </div>

                <div className='flex flex-col items-start'>
                    <label htmlFor='alma_mater'>
                        <span className='font-semibold'> Alma mater </span>

                        <UserGroupInput id={'alma_mater'} input_value={profileData.alma_mater} input_fn={editInformation} />
                    </label>

                    {editErrors.alma_mater &&
                        <InputErr error={editErrors.alma_mater} />
                    }
                </div>

                <div className='flex flex-col items-start'>
                    <label htmlFor='degree'>
                        <span className='font-semibold'> Degree </span>

                        <select id='degree' className='border-solid border-slate-200 bg-slate-200 rounded-2xl p-1 w-[150px]' 
                            value={profileData?.degree} onChange={(e) => editInformation(e)}>
                            <option value='Diploma/GED'> Diploma / GED </option>
                            <option value={`Associate's`}> Associate's </option>
                            <option value={`Bachelor's`}> Bachelor's </option>
                            <option value={`Master's`}> Master's </option>
                            <option value='Ph.D'> Ph.D </option>
                            <option value='None'> None </option>
                        </select>
                    </label>

                    {editErrors.degree &&
                        <InputErr error={editErrors.degree} />
                    }
                </div>

                <div className='flex flex-col items-start'>
                    <label htmlFor='role'>
                        <span id='role' className='font-semibold'> Change your role </span>

                        <UserGroupSelect value={profileData.role} select_fn={editInformation} />

                        {editErrors.role &&
                            <InputErr error={editErrors.role} />
                        }
                    </label>
                </div>
            </div>

            <DescriptionBox description={profileData.description} editDescription={editInformation} is_user={true} /> 
            
            {user?.blocked?.length > 0 &&
                <div>
                    <span className='font-semibold'> Blocked users </span>

                    <ul>
                        {user?.blocked.map(blocked => {
                            <div>
                                <ProfileDisplay profile={blocked} is_logged={false} profile_mode={'index'} />

                                <BlockButton user={blocked} />
                            </div>
                        })}
                    </ul>
                </div>
            }    

            <div className='flex justify-around items-center'>
                <EditButton save_fn={editProfile} /> 

                <DeleteButton delete_fn={deleteAccount} />
            </div>
        </div>
    )
}

export default EditProfile;
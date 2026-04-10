import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useBookStore} from '../../../../Context/bookStore';
import {useFetchLogged, useFetchUsers} from '../../../Functions/Queries/UserQueries';
import {useFetchGroups} from '../../../Functions/Queries/GroupQueries';
import {useEditProfileMutation, useToggleHiddenMutation, useDeleteAccountMutation} from '../../../Functions/Mutations/UserMutations';
import UserGroupInput from '../../../Miscellaneous/Inputs/UserGroupInput';
import UserGroupSelect from '../../../Miscellaneous/Inputs/UserSelectInput';
import ProfileDisplay from './ProfileDisplay';
import ProfileBox from './ProfileBox';
import PageHeader from '../../../Miscellaneous/Text/PageHeader';
import InputErr from '../../../Miscellaneous/Text/Errors/InputErr'
import BlockButton from '../../../Buttons/Profile/User/BlockButton';
import ToggleSwitch from '../../../Buttons/Profile/ToggleSwitch';
import EditButton from '../../../Buttons/Profile/EditButton';
import DeleteButton from '../../../Buttons/Profile/DeleteButton';
import NoItems from '../../../Miscellaneous/Text/NoItems';
import EditProfileLoad from '../../../Miscellaneous/Loading/Profiles/ProfileInformation/EditProfileLoad';

const EditProfile = () => {
    const navigate = useNavigate();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setPopup = useBookStore((state) => state.setPopup);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const loggedData = useFetchLogged([authorized, setAuthorized, setSiteError]);
    const userData = useFetchUsers([authorized, setAuthorized, setSiteError]);
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const [editErrors, setEditErrors] = useState({
        first_name: null,
        last_name: null,
        role: null
    });

    const [profileData, setProfileData] = useState({
        first_name: loggedData.data?.profile?.first_name,
        last_name: loggedData.data?.profile?.last_name,
        alma_mater: !loggedData.data?.profile?.alma_mater ? undefined : loggedData.data.profile.alma_mater,
        degree: !loggedData.data?.profile?.degree ? undefined : loggedData.data.profile.degree,
        role: !loggedData.data?.profile?.role ? undefined : loggedData.data.profile.role,
    });

    const profile_mutation = useEditProfileMutation([
        setEditErrors,
        setPopup, 
        setSiteError
    ]);

    const hidden_mutation = useToggleHiddenMutation(setSiteError);

    const delete_account_mutation = useDeleteAccountMutation([navigate, setSiteError]);

    const editProfile = () => {
        return profile_mutation.mutate({profile: profileData});
    }

    const toggleHiddenStatus = () => {
        return hidden_mutation.mutate();
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
        <div className='flex justify-between items-start'>
            <div className='flex flex-col items-start gap-y-5 m-5'>
                <PageHeader header={'Edit your profile'} />

                <div className='flex justify-between items-center gay-x-10 w-full'>
                    <p className='flex flex-col items-start font-semibold'> Hide profile 
                        <span className='text-sm'> Users won't know you're online </span> 
                    </p>

                    <ToggleSwitch status={loggedData.data?.profile.hidden} toggle_fn={toggleHiddenStatus} />
                </div>

                <div className='flex flex-col items-start gap-y-10 md:grid md:grid-cols-2 md:gap-5'>
                    <div className='flex flex-col items-start'>
                        <label htmlFor='first_name' className='flex flex-col items-start md:flex-row md:justify-around 
                            md:items-center md:gap-x-10'>
                            <span className='font-semibold'> First name </span>

                            <UserGroupInput id={'first_name'} input_value={profileData.first_name} input_fn={editInformation} />
                        </label>

                        {editErrors.first_name && 
                            <InputErr error={editErrors.first_name} />
                        }
                    </div> 

                    <div className='flex flex-col items-start'>
                        <label htmlFor='last_name' className='flex flex-col items-start md:flex-row md:justify-around 
                            md:items-center md:gap-x-10'>
                            <span className='font-semibold'> Last name </span>

                            <UserGroupInput id={'last_name'} input_value={profileData.last_name} input_fn={editInformation} />
                        </label>

                        {editErrors.last_name &&
                            <InputErr error={editErrors.last_name} />
                        }
                    </div>

                    <div className='flex flex-col items-start'>
                        <label htmlFor='alma_mater' className='flex flex-col items-start md:flex-row md:justify-around 
                            md:items-center md:gap-x-10'>
                            <span className='font-semibold'> Alma mater </span>

                            <UserGroupInput id={'alma_mater'} input_value={profileData.alma_mater} input_fn={editInformation} />
                        </label>
                    </div>

                    <div className='flex flex-col items-start'>
                        <label htmlFor='degree' className='flex flex-col items-start md:flex-row md:justify-around
                            md:items-center md:gap-x-10'>
                            <span className='font-semibold'> Degree </span>

                            <select id='degree' className='border-solid border-slate-200 bg-slate-200 rounded-2xl p-1 w-[150px]' 
                                value={profileData.degree} onChange={(e) => editInformation(e)}>
                                <option value=''> Select a degree </option>
                                <option value='Diploma/GED'> Diploma / GED </option>
                                <option value={`Associate's`}> Associate's </option>
                                <option value={`Bachelor's`}> Bachelor's </option>
                                <option value={`Master's`}> Master's </option>
                                <option value='Ph.D'> Ph.D </option>
                                <option value='None'> None </option>
                            </select>
                        </label>
                    </div>

                    <div className='flex flex-col items-start'>
                        <label htmlFor='role' className='flex flex-col items-start md:flex-row md:justify-around 
                            md:items-center md:gap-x-10'>
                            <span id='role' className='font-semibold'> Change your role </span>

                            <UserGroupSelect value={profileData.role} select_fn={editInformation} />    
                        </label>

                        {editErrors.role &&
                            <InputErr error={editErrors.role} />
                        }
                    </div>
                </div>
                
                <div className='flex flex-col gap-y-3 w-full'>
                    <span className='font-semibold text-lg border-b-2 border-slate-200 border-solid'> 
                        Blocked users 
                    </span>

                    {loggedData.data?.blocked.length === 0 ?
                        <NoItems text={`You haven't blocked anyone yet.`} />
                    :
                        <ul className='flex flex-col gap-y-5'>
                            {loggedData.data?.blocked.map(blocked => {
                                <div>
                                    <ProfileDisplay profile={blocked} is_logged={false} profile_mode={'index'} />

                                    <BlockButton user={blocked} />
                                </div>
                            })}
                        </ul>
                    }
                </div>

                <div className='flex justify-around items-center gap-x-10'>
                    <EditButton save_fn={editProfile} /> 

                    <DeleteButton delete_fn={deleteAccount} />
                </div>
            </div>           
                
            <div className='hidden md:flex md:flex-col md:gap-y-5'>
                <ProfileBox 
                    title='Users'
                    profile={loggedData.data?.profile} 
                    items={userData.data?.users} 
                />

                <ProfileBox 
                    title='Groups'
                    profile={loggedData.data?.profile} 
                    items={groupData.data?.groups} 
                />
            </div>
        </div>
    )
}

export default EditProfile;
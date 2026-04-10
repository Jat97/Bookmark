import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {PhotoIcon} from '@heroicons/react/24/solid';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useEditGroupMutation, useGroupPrivacyMutation, useDeleteGroupMutation} from '../../Functions/Mutations/GroupMutations';
import {useBookStore} from '../../../Context/bookStore';
import ProfileDisplay from '../ProfileInformation/Accounts/ProfileDisplay';
import ProfileBox from '../ProfileInformation/Accounts/ProfileBox';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import DescriptionBox from '../../Miscellaneous/Inputs/DescriptionBox';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';
import GroupBanUnbanButton from '../../Buttons/Profile/Group/GroupBanUnbanButton';
import ToggleSwitch from '../../Buttons/Profile/ToggleSwitch';
import EditButton from '../../Buttons/Profile/EditButton';
import DeleteButton from '../../Buttons/Profile/DeleteButton';
import NoItems from '../../Miscellaneous/Text/NoItems';
import EditGroupLoad from '../../Miscellaneous/Loading/Profiles/Groups/EditGroupLoad';

const EditGroup = () => {
    const {groupid} = useParams();

    const navigate = useNavigate();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setPopup = useBookStore((state) => (state.setPopup));
    const setSiteError = useBookStore((state) => state.setSiteError);
    
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const group = groupData.data?.groups.find(group => group.id.toString() === groupid);

    const [groupInfo, setGroupInfo] = useState({
        id: group?.id,
        title: group?.title,
        description: group?.description,
        private: group?.private,
        group_image: group?.group_image
    });

    const [titleError, setTitleError] = useState(null);

    const edit_mutation = useEditGroupMutation([navigate, setTitleError, setPopup, setSiteError]);
    const privacy_mutation = useGroupPrivacyMutation([group, setSiteError]);
    const delete_group_mutation = useDeleteGroupMutation([group, setSiteError]);

    const editData = (e) => {
        setGroupInfo((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }

    const confirmGroupChanges = () => {
        return edit_mutation.mutate({group: groupInfo});
    }

    const toggleGroupPrivacy = () => {
        return privacy_mutation.mutate();
    }

    const deleteGroup = () => {
        return delete_group_mutation.mutate();
    }

    const editImage = () => {
        const file = document.querySelector('#file');

        const file_reader = new FileReader();

        file_reader.addEventListener('loadend', () => {
            const result = file_reader.result;

            setGroupInfo((prevState) => ({
                ...prevState,
                group_image: result
            }));
        });

        return file_reader.readAsDataURL(file.files[0]);
    }

    if(groupData?.isPending) {
        return <EditGroupLoad />
    }
    else {
        return (
            <div className='flex justify-between items-center gap-x-10'>
                <div className='flex flex-col items-start gap-y-10 m-2 w-full'>
                    <PageHeader text={`Edit information for ${group?.title}`} />

                    <label htmlFor='file' className='flex flex-col items-center gap-y-5'>
                        <div className='border border-slate-200'>
                            {groupInfo.group_image ?
                                <img src={groupInfo.group_image} className='w-[250px] md:w-[300px]'></img>
                            :
                                <PhotoIcon className='h-52 md:h-60' />         
                            }
                        </div>
                    
                        <span className='font-semibold'> Upload an image </span>
                        
                        <input type='file' id='file' className='hidden' onChange={() => editImage()}></input>
                    </label>

                    <div className='flex justify-between items-center gap-x-10 w-full md:w-2/3'>
                        <p className='flex flex-col items-start font-semibold'> 
                            Group privacy 

                            <span className='text-sm'> 
                                Users need to be approved to view the group's page. 
                            </span>
                        </p>

                        <ToggleSwitch status={group?.private} toggle_fn={toggleGroupPrivacy} />
                    </div> 
                    
                    <div className='relative'>
                        <label htmlFor='title' className='flex flex-col items-start gap-y-2'>
                            <span className='font-semibold'> Title </span>
                            
                            <UserGroupInput id={'title'} input_value={groupInfo.title} input_fn={editData} />
                        </label>

                        {titleError &&
                            <InputErr error={titleError} />
                        }
                    </div>
                    
                    <DescriptionBox description={groupInfo.description} editDescription={editData} is_user={false} /> 
                    
                    <div className='flex flex-col items-start gap-y-3 w-full'>
                        <span className='font-semibold text-lg border-b-2 border-slate-200 border-solid w-full md:w-2/3'> 
                            Banned users 
                        </span>

                        {group.banned_users.length === 0 ?
                            <NoItems text={'No users have been banned.'} />
                        :
                            <ul>
                                {group?.banned_users?.map(user => {
                                    return (
                                        <li className='flex justify-around items-center gap-x-10'>
                                            <ProfileDisplay profile={user} is_logged={false} profile_mode={'index'} />

                                            <GroupBanUnbanButton group={group} member={user} />
                                        </li>
                                    )
                                })}
                            </ul>
                        }
                    </div>

                    <div className='flex justify-around items-center gap-x-10'>
                        <EditButton save_fn={confirmGroupChanges} />

                        <DeleteButton delete_fn={deleteGroup} />
                    </div>
                </div>

                <div className='flex flex-col content-start gap-y-8'>
                    <ProfileBox 
                        title={'Members'}
                        profile={group}
                        items={group?.members}
                    />

                    <ProfileBox 
                        title={'Requests'}
                        profile={group}
                        items={group?.requests}
                    />
                </div>
            </div>
        )
    }   
}

export default EditGroup;
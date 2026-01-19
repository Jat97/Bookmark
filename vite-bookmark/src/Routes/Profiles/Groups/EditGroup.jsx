import {useParams} from 'react-router-dom';
import {PhotoIcon} from '@heroicons/react/24/solid';
import {useFetchGroups} from '../../Functions/Queries/GroupQueries';
import {useEditGroupMutation, useGroupPrivacyMutation, useDeleteGroupMutation} from '../../Functions/Mutations/GroupMutations';
import {useDeleteGroupMutation} from '../../Functions/Mutations/GroupMutations';
import {useBookStore} from '../../../Context/bookStore';
import ProfileDisplay from '../ProfileInformation/ProfileDisplay';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
import UserGroupInput from '../../Miscellaneous/Inputs/UserGroupInput';
import DescriptionBox from '../../Miscellaneous/Inputs/DescriptionBox';
import InputErr from '../../Miscellaneous/Text/Errors/InputErr';
import GroupBanUnbanButton from '../../Buttons/Profile/Group/GroupBanUnbanButton';
import ToggleSwitch from '../../Buttons/Profile/ToggleSwitch';
import EditButton from '../../Buttons/Profile/EditButton';
import DeleteButton from '../../Buttons/Profile/DeleteButton';

const EditGroup = () => {
    const {groupid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);
    
    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);

    const group = groupData.data.groups.find((group) => group.id.toString() === groupid);

    const [groupInfo, setGroupInfo] = useState({
        title: group.title,
        description: group.description
    });

    const [groupImage, setGroupImage] = useState(group?.group_image);
    const [titleError, setTitleError] = useState(null);

    const editMutation = useEditGroupMutation([group, setTitleError, setSiteError]);
    const privacyMutation = useGroupPrivacyMutation([group, setSiteError]);
    const deleteGroupMutation = useDeleteGroupMutation([group, setSiteError]);

    const editData = (e) => {
        setGroupInfo((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }

    const confirmGroupChanges = () => {
        editMutation.mutate();
    }

    const toggleGroupPrivacy = () => {
        privacyMutation.mutate();
    }

    const deleteGroup = () => {
        deleteGroupMutation.mutate();
    }

    const editImage = () => {
        const file_input = document.querySelector('#file');

        const file_reader = new FileReader();

        file_reader.addEventListener('loadend', () => {
            const result = file_reader.result;

            setGroupImage(result);
        });

        file_reader.readAsDataUrl(file_input.files[0]);
    }

    if(groupData?.isPending) {
        return <div></div>
    }

    return (
        <div>
            <PageHeader props={`Edit information for ${group?.title}`} />

            <div>
                <label for='file'>
                    {groupImage ?
                        <img src={group?.group_image}></img>
                    :
                        <PhotoIcon className='h-10' />         
                    }
                    
                    <span className='font-semibold'> Upload an image </span>
                    
                    <input type='file' id='file' className='hidden' onChange={() => editImage()}></input>
                </label>
            </div>

            <ToggleSwitch status={group?.private} toggle_fn={toggleGroupPrivacy} />

            <div>
                <div className='flex flex-col items-start'>
                    <label htmlFor='title'>
                        <span className='font-semibold'> Title </span>
                        
                        <UserGroupInput id={'title'} input_value={groupInfo.title} input_fn={editData} />
                    </label>

                    {titleError &&
                        <InputErr error={titleError} />
                    }
                </div>
                
               <DescriptionBox description={groupInfo.description} editDescription={editData} is_user={false} /> 
            </div>

            <div className='flex flex-col items-start'>
                <span className='font-semibold'> Banned users </span>

                <div>
                    {group?.banned_users?.map(user => {
                        return (
                            <div>
                                <ProfileDisplay profile={user} is_logged={false} profile_mode={'index'} />

                                <GroupBanUnbanButton group={group} member={member} />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='flex justify-around items-center'>
                <EditButton save_fn={confirmGroupChanges} />

                <DeleteButton delete_fn={deleteGroup} />
            </div>
        </div>
    )
}

export default EditGroup;
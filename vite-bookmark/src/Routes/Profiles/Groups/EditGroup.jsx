import {useEffect} from 'react';
import {PhotoIcon} from '@heroicons/react/24/solid';
import {useEditGroupMutation} from '../../Functions/Mutations/GroupMutations';
import {useDeleteGroupMutation} from '../../Functions/Mutations/GroupMutations';
import {useBookStore} from '../../../Context/bookStore';
import ProfileDisplay from '../../Miscellaneous/Images/ProfileDisplay';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
import DescriptionBox from '../../Miscellaneous/Inputs/DescriptionBox';
import GroupBanUnbanButton from '../../Buttons/GroupBanUnbanButton';
import EditButton from '../../Buttons/EditButton';

const EditGroup = (props) => {
    const group = props.props;

    const description_value = useBookStore((state) => state.description);
    const setDescriptionValue = useBookStore((state) => state.setDescriptionValue);
    const setSiteError = useBookStore((state) => state.setSiteError);

    useEffect(() => {
        if(!description_value) {
            setDescriptionValue(group.description);
        }
    }, [description_value, group]);

    const [groupImage, setGroupImage] = useState(group?.group_image);

    const editMutation = useEditGroupMutation([group, setSiteError]);
    const deleteGroupMutation = useDeleteGroupMutation([group, setSiteError]);

    const confirmGroupChanges = () => {
        editMutation.mutate();
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

            <DescriptionBox props={[description_value, false]} />

            <div>
                <span className='font-semibold'> Banned users </span>

                <div>
                    {group?.banned_users?.map(user => {
                        return (
                            <div>
                                <ProfileDisplay props={[user, false, 'index']} />

                                <GroupBanUnbanButton props={[group, member]} />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className='flex flex-col items-center'>
                <div className='flex justify-around items-center'>
                    <EditButton props={confirmGroupChanges} />

                    <Link to={`/api/group/${group?.id}`} className='text-center bg-slate-200 p-2 max-w-12'> 
                        Cancel 
                    </Link>
                </div>
                
                <button type='button' className='text-white bg-red-400 hover:bg-pink-100' onClick={() => deleteGroup()}>
                    Delete group
                </button>
            </div>
        </div>
    )
}

export default EditGroup;
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {PhotoIcon} from '@heroicons/react/24/solid';
import {useFetchGroups} from '../Functions/Queries/GroupQueries';
import {useEditGroupMutation} from '../Functions/Mutations/GroupMutations';
import {useDeleteGroupMutation} from '../Functions/Mutations/GroupMutations';
import {useBookStore} from '../../Context/bookStore';
import UserDisplay from '../Users/UserDisplay';
import PageHeader from '../Miscellaneous/Text/PageHeader';
import TextBox from '../Miscellaneous/Inputs/TextBox';
import RemoveMemberButton from '../Buttons/RemoveMemberButton';

const GroupInfoPage = () => {
    const {groupid} = useParams();

    const authorized = useBookStore((state) => state.authorized);
    const setAuthorized = useBookStore((state) => state.setAuthorized);
    const setSiteError = useBookStore((state) => state.setSiteError);

    const groupData = useFetchGroups([authorized, setAuthorized, setSiteError]);
    const selected_group = groupData.data?.groups?.find(group => group.id === groupid);

    const [groupDescription, setGroupDescription] = useState(selected_group ? selected_group?.description : '');
    const [groupImage, setGroupImage] = useState(selected_group?.group_image);

    const editMutation = useEditGroupMutation([selected_group, setSiteError]);
    const deleteGroupMutation = useDeleteGroupMutation([selected_group, setSiteError]);

    const updateGroupDescription = (e) => {
        setGroupDescription(e.currentTarget.value);
    }

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
            <Navbar />

            <div> 
                <PageHeader props={`Edit information for ${selected_group?.title}`} />

                <div>
                    <label>
                        {groupImage ?
                            <img src={selected_group?.group_image}></img>
                        :
                            <PhotoIcon className='h-10' />         
                        }
                        
                        Upload an image
                        
                        <input type='file' id='file' className='hidden' onChange={() => editImage()}></input>
                    </label>
                </div>

                <div>
                    <TextBox props={[groupDescription, updateGroupDescription]} />
                </div>

                <div>
                    Members

                    <div>
                        {selected_group?.members?.map(member => {
                            return (
                                <div>
                                    <UserDisplay props={[member, '']} />

                                    <RemoveMemberButton props={[selected_group, member]} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <div>
                        <button type='button' onClick={() => confirmGroupChanges()}> Save changes </button> 

                        <Link to={`/api/group/${selected_group?.id}`}> Cancel </Link>
                    </div>
                   
                   <button type='button'>
                        Delete group
                   </button>
                </div>
            </div>
        </div>
    )
}

export default GroupInfoPage;
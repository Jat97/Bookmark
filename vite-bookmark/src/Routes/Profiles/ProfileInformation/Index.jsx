import FriendButton from '../../Buttons/FriendButton';
import BlockButton from '../../Buttons/BlockButton';
import GroupRequestLeaveButton from '../../Buttons/GroupRequestLeaveButton';
import AcceptButton from '../../Buttons/AcceptButton';
import RejectButton from '../../Buttons/RejectButton';
import PageHeader from '../../Miscellaneous/Text/PageHeader';
import ProfileDisplay from '../../Miscellaneous/Images/ProfileDisplay';

const Index = (props) => {
    const logged = props.props[0];
    const moderator = props.props[1];
    const items = props.props[2];

    return (
        <div>            
            <PageHeader props={location.pathname.includes('groups') ? 'Groups' : 'Users'} />

            <ul className='flex flex-col items-center'>
                {items?.map((item) => {
                    return (
                        <li className='flex justify-around items-center w-2/3'>
                            <ProfileDisplay props={[item, false, 'index']} />

                            {item.title && logged ?
                                <GroupRequestLeaveButton props={[
                                    loggedData.data.logged_user, 
                                    item,
                                    item.members.some((member) => member.id === loggedData.data.logged_user.id)
                                ]} />
                            :
                                item.title && moderator ?
                                    <div>
                                        <AcceptButton props={item} />

                                        <RejectButton props={item} />
                                    </div>
                                :
                                    <div className='flex flex-col items-center'>
                                        <FriendButton props={item} />

                                        <BlockButton props={item} />
                                    </div>
                            }
                        </li>
                    )
                })}
            </ul>
        </div>
    )
};

export default Index;
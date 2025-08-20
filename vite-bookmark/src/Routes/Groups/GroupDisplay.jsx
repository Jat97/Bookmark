import {BookOpenIcon} from '@heroicons/react/24/solid';

const GroupDisplay = (props) => {
    const group = props.props[0];
    const group_mode = props.props[1];

    return (
        <div>
            {group.group_image ?
                <img src={group.group_image}></img>
            :
                <BookOpenIcon className='h-6'/>
            }

            <p> {group.title} </p>
        </div>
    )
};

export default GroupDisplay;
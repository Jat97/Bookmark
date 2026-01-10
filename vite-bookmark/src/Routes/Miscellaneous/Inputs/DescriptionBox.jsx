import {useBookStore} from '../../Context/bookStore';

const DescriptionBox = (props) => {
    const description = props.props[0];
    const is_user = props.props[1];

    const setDescriptionValue = useBookStore((state) => state.setDescriptionValue);

    const updateDescription = (e) => {
        setDescriptionValue(e.currentTarget.value);
    }

    return (
        <label for='description' className='flex flex-col items-start'>
            <span className='font-semibold'> Description </span>

            <textarea id='description' cols='45' rows='10' value={description} 
                placeholder={`${is_user ? 'How would you describe yourself?' : 'What is the purpose of this group?'}`} 
                onChange={(e) => updateDescription(e)}>
            </textarea>
        </label> 
    )
}

export default DescriptionBox;
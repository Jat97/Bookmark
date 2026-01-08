import {useBookStore} from '../../Context/bookStore';

const GroupDescriptionBox = () => {
    const description_value = useBookStore((state) => state.description_value);
    const setDescriptionValue = useBookStore((state) => state.setDescriptionValue);

    const updateDescription = (e) => {
        setDescriptionValue(e.currentTarget.value);
    }

    return (
        <label for='description' className='flex flex-col items-start'>
            <span className='font-semibold'> Group description </span>

            <textarea id='description' cols='45' rows='10' value={description_value} 
                placeholder='What is the purpose of this group?' onChange={(e) => updateDescription(e)}>
            </textarea>
        </label> 
    )
}

export default GroupDescriptionBox;
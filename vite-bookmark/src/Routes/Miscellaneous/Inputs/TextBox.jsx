import {Editor} from '@tinymce/tinymce-react';
import {useState} from 'react';
import {PencilIcon} from '@heroicons/react/24/solid';
import {useCreatePostMutation, useEditPostMutation} from '../../Functions/Mutations/PostMutations';
import {useBookStore} from '../../../Context/bookStore';

const TextBox = (props) => {
    const postid = props.props[0];
    const poster = props.props[1];
    const cancelFn = props.props[2];

    const [text, setText] = useState('');

    const textRef = useBookStore((state) => state.textRef);
    const setTextEditor = useBookStore((state) => state.setTextEditor);
    const setSiteError = useBookStore((state) => state.setSiteError);
    
    const create_post_mutation = useCreatePostMutation([poster, text, setText, setSiteError]);
    const edit_post_mutation = useEditPostMutation([postid, text, setText, setSiteError]);

    const createPost = () => {
        return create_post_mutation.mutate();    
    }

    const editPost = () => {
        return edit_post_mutation.mutate();
    }

    const handleText = () => {
        setText(textRef.getContent());
    }

    return (
        <div className='flex flex-col items-center gap-1'>
            <Editor placeholder='What would you like to say?'
                value={text}
                onEditorChange={() => handleText()}
                apiKey={import.meta.env.VITE_APP_API_KEY}
                onInit={(e, editor) => setTextEditor(editor)}
                init={{
                    entity_encoding: 'raw',
                    height: '200',
                    placeholder: 'What would you like to say?',
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks |' + 'image | bold italic forecolor | alignleft aligncenter' + 
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }',
                    image_title: true,
                    automatic_uploads: true,
                    file_picker_types: 'image',
                    file_picker_callback: (cb, value, meta) => {
                        const input = document.createElement('input');
                        input.setAttribute('type', 'file');
                        input.setAttribute('accept', 'image/*');
                
                        input.addEventListener('change', (e) => {
                            const file = e.target.files[0];
                
                            const file_reader = new FileReader();
                
                            file_reader.addEventListener('load', () => {
                            const id = 'blobid' + (new Date()).getTime();
                            const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                            const base64 = file_reader.result.split(',')[1];
                            const blobInfo = blobCache.create(id, file, base64);
                            blobCache.add(blobInfo);
                
                            cb(blobInfo.blobUri(), {title: file.name});
                            }); 
                            
                            file_reader.readAsDataURL(file);
                        });
                
                        input.click()
                    }
                }}>
            </Editor>

            <div className='font-semibold flex justify-around items-center w-full'>
                <button type='button' className='flex justify-evenly items-center bg-cyan-200 rounded-full 
                    md:w-[150px] hover:bg-sky-100' 
                    onClick={() => postid ? editPost() : createPost()}>
                    <PencilIcon className='h-6' />

                    Submit
                </button>

                <button type='button' className={`bg-slate-200 rounded-full md:w-[150px]
                    ${!cancelFn ? 'cursor-not-allowed' : 'hover:bg-zinc-100'}`} 
                    disabled={`${cancelFn && false}`} onClick={cancelFn}>
                    Cancel
                </button>
            </div>
        </div>
    )
};

export default TextBox;
import {Editor} from '@tinymce/tinymce-react';
import {bookStore} from '../../../Context/bookStore';

const TextBox = (props) => {
    const text = props.props[0];
    const textHandler = props.props[1];

    const setTextEditor = bookStore((state) => state.setTextEditor);

    return (
        <Editor placeholder='What would you like to say?'
        onEditorChange={textHandler}
        apiKey={import.meta.env.REACT_TINY_KEY}
        onInit={(e, editor) => setTextEditor(editor)}
        init={{
            entity_encoding: 'raw',
            height: '250',
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
    )
};

export default TextBox;
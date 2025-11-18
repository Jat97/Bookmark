import fse from 'fs-extra';
import path from 'path';

const directory = './public/tinymce';

fse.emptyDirSync(path.join(directory));

fse.copySync(path.join('node_modules', 'tinymce'), directory, {overwrite: true});
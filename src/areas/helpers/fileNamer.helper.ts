import {v4 as uuid}from 'uuid'

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('file '), false);

    const fileExt = file.mimetype.split('/')[1];
    const fileName=`${uuid()}.${fileExt}`;
    // return callback(null, fileName); 
  callback(null, fileName);
};
// ${Date.now()}
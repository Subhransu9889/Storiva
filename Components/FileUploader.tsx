'use client'
import React, {useCallback, MouseEvent} from 'react'
import {useDropzone} from 'react-dropzone'
import {Button} from "@/Components/ui/button";
import {cn, convertFileToUrl, getFileType} from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/Components/Thumbnail";
import {MAX_FILE_SIZE} from "@/constants";
import { toast } from "sonner"
import {uploadFile} from "@/lib/actions/file.action";
import {usePathname} from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ownerId, accountId, className}: Props) => {
    const [files, setFiles] = React.useState<File[]>([]);
    const path = usePathname();
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
    // Do something with the files

      const uploadPromises = acceptedFiles.map(async (file) => {
          if(file.size > MAX_FILE_SIZE) {
              setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
              return toast.error(<p className='body-2 text-white'>
                  <span className='font-semibold'>{file.name}</span>
                  is too large. Max file size is <span className='font-semibold'>{MAX_FILE_SIZE / 1000000} MB</span>.
              </p>, {className: 'error-toast'});
           }
          return uploadFile({file, ownerId, accountId, path}).then((uploadFile) => {
              if(uploadFile) {
                  setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
              }
          })
      });
      await Promise.all(uploadPromises);
  }, [ownerId, accountId, path])
  const {getRootProps, getInputProps} = useDropzone({onDrop})

    const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, FileName: string) => {
        e.stopPropagation();
        setFiles((prevFile) => prevFile.filter((file) => file.name !== FileName));
    }

  return (
      <div {...getRootProps()} className='cursor-pointer'>
        <Button
          type='button'
          className={cn('uploader-button', className)}
        >
          <Image src='/assets/icons/upload.svg' alt='upload' width={24} height={24}/>
          <p>Upload</p>
        </Button>
          {files.length > 0 && (
              <ul className='uploader-preview-list'>
                  <h4 className='h4 text-light-100'>Uploading...</h4>

                  {files.map((file, index) => {
                      const {type, extension} = getFileType(file.name);

                      return (
                          <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                              <div className='flex items-center gap-3'>
                                  <Thumbnail
                                    type={type}
                                    extension={extension}
                                    url={convertFileToUrl(file)}
                                  />
                                  <div className='preview-item-name'>
                                      {file.name}
                                      <Image src='/assets/icons/file-loader.gif' alt='file-loader' width={80} height={80}/>
                                  </div>
                              </div>
                              <Image src='/assets/icons/remove.svg' alt='remove' width={24} height={24} className='uploader-remove-button' onClick={(e) => handleRemoveFile(e, file.name)}/>
                          </li>
                      )
                  })}
              </ul>
          )}
        <input {...getInputProps()} />
      </div>
  )
};

export default FileUploader;
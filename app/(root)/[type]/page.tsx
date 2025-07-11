import React from 'react';
import Sort from "@/Components/Sort";
import {getFiles} from "@/lib/actions/file.action";
import {Models} from "node-appwrite";
import Card from "@/Components/Card";
import {getFileTypesParams} from "@/lib/utils";

const Page = async ({searchParams, params}: SearchParamProps) => {
    const type = (await params).type;
    const searchText = ((await searchParams)?.query as string) || '';
    const sort = ((await searchParams)?.sort as string) || '';

    const types = getFileTypesParams(type) as FileType[];
    const files = await getFiles({types, searchText, sort});

  return <div className='page-container'>
      <section className='w-full'>
          <h1 className='h1 capitalize'>{type}</h1>
          <div className='total-size-section'>
              <p className='body-1'>
                  Total: <span className='h5'>100 MB</span>
              </p>
              <div className='sort-container'>
                  <p  className='body-1 hidden text-light-200 sm:block'>Sort by: </p>
                  <Sort/>
              </div>
          </div>
      </section>
  {/*    render the file */}
      {files.total > 0 ? (
          <section className='file-list'>
              {files.documents.map((file: Models.Document) => (
                  <Card key={file.$id} file={file}/>
              ))}
          </section>
      ) : <p className='empty-list'>No Files Uploaded yet</p>}
  </div>;
};

export default Page;
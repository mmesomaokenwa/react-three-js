import React from 'react'
import CustomButton from './CustomButton';

const FilePicker = ({ file, setFile, readFile }) => {
  return (
    <div className="filepicker-container">
      <div className="flex flex-1 flex-col">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label">
          Upload File
        </label>
        <p className='text-xs text-gray-500 mt-4 truncate'>{file ? file.name : 'No file selected'}</p>
        <div className="mt-auto w-full flex justify-center items-center gap-3">
          <CustomButton type="outline" title="Logo" handleClick={() => readFile('logo')} customStyles="text-xs" />
          <CustomButton type="filled" title="Full" handleClick={() => readFile('full')} customStyles="text-xs" />
        </div>
      </div>
    </div>
  );
}

export default FilePicker
import { ChangeEvent, useRef, useState } from 'react';
import { useUploadFile } from '../api';

export function FileUploader() {
  const uploadFile = useUploadFile();
  const [file, setFile] = useState<File>();
  const fileInput = useRef<HTMLInputElement>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    } else {
      setFile(undefined);
    }
  };

  const upload = async () => {
    if (file) {
      const result = await uploadFile(file.name, file);
      if (fileInput.current) {
        fileInput.current.value = '';
        setFile(undefined);
      }
    }
  };

  return (
    <div className="file-uploader">
      <h2>Upload file</h2>
      <div className="file-uploader-content">
        <label className="file-uploader-selector">
          <input type="file" onChange={onFileChange} ref={fileInput} />
          {file ? file.name : 'Click to choose file...'}
        </label>
        <button onClick={upload}>Upload</button>
      </div>
    </div>
  );
}

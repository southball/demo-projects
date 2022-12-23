import { useDeleteFile, useListFiles } from '../api';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function FileList() {
  const { data, error, isLoading } = useListFiles();
  const deleteFile = useDeleteFile();

  return (
    <>
      <h2>File List</h2>
      {isLoading ? (
        <>Loading...</>
      ) : error ? (
        <>Error</>
      ) : (
        <div className="file-list">
          {data?.map((file) => (
            <div>
              <a href={`/download/${encodeURI(file.name)}`}>{file.name}</a>
              &nbsp;
              <button onClick={() => deleteFile(file.name)}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

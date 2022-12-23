import useSWR, { SWRResponse, useSWRConfig } from 'swr';
import type { BucketItem } from 'minio';

const fetcherJSON = (args: string) => {
  return fetch(args).then((response) => response.json());
};

export const useListFiles = (): SWRResponse<BucketItem[]> => {
  return useSWR('/files', fetcherJSON);
};

export const useUploadFile = (): ((filename: string, file: File) => void) => {
  const { mutate } = useSWRConfig();
  return (filename, file) => {
    const formData = new FormData();
    formData.set('file', file);
    return fetch(`/upload/${encodeURI(filename)}`, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      mutate((_key) => true, undefined);
      return response.json();
    });
  };
};

export const useDeleteFile = (): ((filename: string) => void) => {
  const { mutate } = useSWRConfig();
  return (filename) => {
    return fetch(`/delete/${encodeURI(filename)}`, {
      method: 'POST',
    }).then((response) => {
      mutate((_key) => true, undefined);
      return response.text();
    });
  };
};

// In-memory ad-hoc folder "database".

type Folder = {
  id: string;
  name: string;
  parentId: string;
  children: Folder[];
};

export const folders: Folder[] = [];

export function createFolder(
  name: string,
  fileSystemId: string,
  parentId: string,
): Folder {
  console.log(`Creating folder '${name}' in file system '${fileSystemId}'.`);
  const folder: Folder = {
    id: generateGuid(),
    name,
    parentId,
    children: [],
  };
  folders.push(folder);
  return folder;
}

function generateGuid(): string {
  const array = new Uint8Array(10);
  const values = Array.from(global.crypto.getRandomValues(array));
  const guid = values
    .map((v) => Number(v).toString(16).padStart(2, '0'))
    .join('-');
  return guid;
}

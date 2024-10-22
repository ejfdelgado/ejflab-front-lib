export interface FileRequestData {
  type: string; // file, fileimage, photo, fileimage-photo, fileaudio
  mimeType?: string;
  defaultFileName?: string | null;
}

export interface FileSaveData {
  base64: string;
  fileName: string;
  erasefile?: string | null;
  isPublic?: boolean;
  isImage?: boolean;
}

export interface FileSaveResponseData {
  uri: string;
  key: string;
  bucket: string;
}

export interface FileServiceI {
  // Delete a file with a path
  delete(url: string): Promise<void>;
  // Reads a file
  readPlainText(url: string): Promise<string>;
  // Saves a file
  save(payload: FileSaveData): Promise<FileSaveResponseData>;
}

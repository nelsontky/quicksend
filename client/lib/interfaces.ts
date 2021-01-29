export interface SelectedFile {
  file: File;
  progress: number;
  status: "selected" | "pending" | "uploading" | "completed" | "error";
  downloadLink?: "string";
}

export interface UploadUrls {
  key: string;
  uploadId: string;
  signedUrls: string[];
}

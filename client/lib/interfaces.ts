export interface SelectedFile {
  file: File;
  progress: number;
  status: "selected" | "pending" | "uploading" | "completed" | "error";
}

export interface UploadData {
  authorizationToken: string;
  uploadUrl: string;
}

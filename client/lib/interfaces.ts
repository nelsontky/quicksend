export interface SelectedFile {
  file: File;
  progress: number;
  status: "selected" | "pending" | "uploading" | "completed" | "error";
}

export interface SignedPut {
  id: string;
  url: string;
}

export interface SelectedFile {
  file: File;
  progress: number;
  status: "selected" | "pending" | "uploading" | "completed";
}

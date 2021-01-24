import React from "react";

import SelectedFile from "./SelectedFile";
import { SelectedFile as ISelectedFile } from "../lib/interfaces";

export type SelectedFilesProps = {
  selectedFiles: ISelectedFile[];
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLUListElement>,
  HTMLUListElement
>;

export default function SelectedFiles({
  selectedFiles,
  ...rest
}: SelectedFilesProps) {
  return (
    <ul {...rest}>
      {selectedFiles.map((file, i) => (
        <SelectedFile selectedFile={file} key={"selected-file-" + i} />
      ))}
    </ul>
  );
}

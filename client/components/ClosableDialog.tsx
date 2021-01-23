import React from "react";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";

import CloseIcon from "@material-ui/icons/Close";

export default function ClosableDialog(props: DialogProps) {
  const { onClose, children, ...rest } = props;
  return (
    <Dialog onClose={onClose} {...rest}>
      <DialogActions>
        <IconButton
          size="small"
          onClick={(e) => {
            onClose(e, "escapeKeyDown");
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>
      {children}
    </Dialog>
  );
}

import { Box, Modal, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage } from "./FormattedMessage";
import { IMessage } from "@/types";
import { Close } from "./Close";
import { maxAllowedCommentLength } from "@/constants";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface IProps {
  open: boolean;
  handleClose: () => void;
  message: IMessage;
}

export const CrmForm: React.FC<IProps> = ({ open, handleClose, message }) => {
  const [value, setValue] = useState("");
  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{ overflow: "scroll" }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Close onClose={handleClose} />
        <Stack rowGap={1} alignItems="center">
          <Typography variant="h6">Отправить данные в битрикс</Typography>
          <Stack columnGap={2} direction="row">
            <Stack rowGap={1} sx={{ width: "100%" }}>
              <FormattedMessage
                message={message}
                ignoreDuplicates
                onStatusChange={handleClose}
                canFinalize
              />
              <Typography>
                Длина:{" "}
                <span
                  style={{
                    color:
                      value.length > maxAllowedCommentLength
                        ? "red"
                        : "inherit",
                  }}
                >
                  {value.length}
                </span>
                /{maxAllowedCommentLength}
              </Typography>
              <TextField
                value={value}
                onChange={(ev) => setValue(ev.target.value)}
                rows={10}
                multiline
              />
            </Stack>
            <script data-b24-form="inline/11/qiykwj" data-skip-moving="true">
              {
              function (w, d, u) {
                var s = d.createElement("script");
                s.async = true;
                s.src = u + "?" + ((Date.now() / 180000) | 0);
                var h = d.getElementsByTagName("script")[0];
                h.parentNode?.insertBefore(s, h);
                return undefined
              }(
                window,
                document,
                "https://cdn-ru.bitrix24.ru/b20819102/crm/form/loader_11.js"
              )}
            </script>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

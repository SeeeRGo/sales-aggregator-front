import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Fab, FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";

export default function AddChannelForm() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [channelName, setChannelName] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Fab
        color="primary"
        onClick={handleClick}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        aria-label="add"
      >
        <Add />
      </Fab>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Stack rowGap={1} sx={{ padding: 2 }}>
          <Typography variant="subtitle1"> Добавить канал</Typography>
          <TextField
            value={channelName}
            onChange={(ev) => setChannelName(ev.target.value)}
            label="Название канала"
            variant="standard"
          />
          <FormControlLabel
            control={<Switch value={false} disabled />}
            label="Добавить в агрегатор"
          />
          <Button
            onClick={async () => {
              await axios.post('http://192.168.63.178:5000/add', {
                chat_name: channelName,
                should_track: false,
              });
              setChannelName("");
              handleClose();
            }}
          >
            Сохранить канал
          </Button>
        </Stack>
      </Popover>
    </div>
  );
}

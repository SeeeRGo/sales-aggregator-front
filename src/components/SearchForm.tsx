import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Fab, Stack, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import { fetchSearchResultsFx, setSearchQuery } from "@/effects/search";

interface IProps {
  onSubmit: () => void
}
export const SearchForm = ({ onSubmit }: IProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState("");

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
        color="info"
        onClick={handleClick}
        sx={{ position: "fixed", bottom: 50, right: 20 }}
        aria-label="search"
      >
        <Search/>
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
          <Typography variant="subtitle1">Поиск похожих сообщений</Typography>
          <TextField
            value={query}
            multiline
            rows={10}
            onChange={(ev) => setQuery(ev.target.value)}
            label="Запрос"
            variant="standard"
          />
          <Button
            onClick={async () => {
              await fetchSearchResultsFx(query);
              setSearchQuery(query);
              setQuery("");
              onSubmit()
              handleClose();
            }}
          >
            Поиск
          </Button>
        </Stack>
      </Popover>
    </div>
  );
}

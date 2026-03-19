import * as React from "react";
import {
  Box,
  IconButton,
  InputBase,
  ClickAwayListener,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  onSubmit?: (q: string) => void; // For pressing Enter
  onType?: (q: string) => void; // For typing (debounced)
  onStartTyping?: (q: string) => void;
  dropdownContent?: React.ReactNode; // For displaying the results box
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
};

export default function SearchIconExpand({
  onSubmit,
  onType,
  onStartTyping,
  dropdownContent,
  placeholder = "Tìm kiếm…",
  initialValue = "",
  debounceMs = 300,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  const debounced = React.useRef<number | null>(null);
  const scheduleType = React.useCallback(
    (next: string) => {
      if (!onType) return;
      if (debounced.current) window.clearTimeout(debounced.current);
      debounced.current = window.setTimeout(() => onType(next), debounceMs);
    },
    [onType, debounceMs]
  );

  const open = () => setExpanded(true);
  const close = () => {
    setExpanded(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);

    if (onStartTyping) onStartTyping(next);

    scheduleType(next);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSubmit && value.trim()) {
      onSubmit(value);
      close();
    }
    if (e.key === "Escape") close();
  };

  const clearValue = () => {
    setValue("");
    if (onType) onType("");
  };

  return (
    <ClickAwayListener onClickAway={close}>
      <Box
        onMouseEnter={open}
        onMouseLeave={close}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: { xs: 0, sm: 1 },
          px: 0.5,
          py: 0.25,
          borderRadius: 2,
          transition: (t) => t.transitions.create(["background-color"]),
          position: "relative",
        }}
      >
        <IconButton size="small" aria-label="Search" onClick={open}>
          <SearchIcon fontSize="small" />
        </IconButton>

        <Box sx={{ position: "relative" }}>
          <InputBase
            value={value}
            onChange={handleChange}
            onFocus={open}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            sx={{
              width: expanded ? { xs: 120, md: 250 } : 0,
              opacity: expanded ? 1 : 0,
              transition: (t) =>
                t.transitions.create(["width", "opacity"], {
                  duration: t.transitions.duration.shorter,
                }),
              px: expanded ? 1 : 0,
              py: 0.5,
              border: expanded ? "1px solid" : "1px solid transparent",
              borderColor: expanded ? "divider" : "transparent",
              borderRadius: 1,
              fontSize: 13,
            }}
          />

          {expanded && value && (
            <IconButton
              size="small"
              onClick={clearValue}
              sx={{
                position: "absolute",
                top: "50%",
                right: 0,
                translate: "0 -50%",
                ml: -0.5,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {expanded && value && dropdownContent && (
          <Box
            sx={{
              position: { xs: "fixed", md: "absolute" },

              top: { xs: "70px", md: "100%" },
              left: { xs: "50%", md: "auto" },
              right: { xs: "auto", md: 0 },
              transform: { xs: "translateX(-50%)", md: "none" },
              pt: { xs: 0, md: 1.5 },
              zIndex: 9999,
              display: "block",
              width: { xs: "96vw", md: 400 },
            }}
          >
            <Paper
              elevation={4}
              onClick={() => {
                close();
                clearValue();
              }}
              sx={{
                width: "100%",
                maxHeight: "450px",
                overflowY: "auto",
                p: 0,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
              }}
            >
              {dropdownContent}
            </Paper>
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}

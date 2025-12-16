// SearchIconExpand.tsx
import * as React from 'react';
import { Box, IconButton, InputBase, ClickAwayListener } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  onSearch?: (q: string) => void;
  placeholder?: string;
  initialValue?: string;
  maxWidth?: number; // px
  debounceMs?: number; // ms
};

export default function SearchIconExpand({
  onSearch,
  placeholder = 'Tìm kiếm…',
  initialValue = '',
  maxWidth = 280,
  debounceMs = 300,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  // Debounce
  const debounced = React.useRef<number | null>(null);
  const scheduleSearch = React.useCallback(
    (next: string) => {
      if (!onSearch) return;
      if (debounced.current) window.clearTimeout(debounced.current);
      debounced.current = window.setTimeout(() => onSearch(next), debounceMs);
    },
    [onSearch, debounceMs]
  );

  // Expand on hover or focus
  const open = () => setExpanded(true);
  const close = () => {
    setExpanded(false);
    // Không tự clear value để người dùng quay lại vẫn giữ chữ
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);
    scheduleSearch(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) onSearch(value);
    if (e.key === 'Escape') close();
  };

  const clearValue = () => {
    setValue('');
    if (onSearch) onSearch('');
  };

  return (
    <ClickAwayListener onClickAway={close}>
      <Box
        onMouseEnter={open}
        onMouseLeave={close}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 0.5,
          py: 0.25,
          borderRadius: 2,
          transition: (t) => t.transitions.create(['background-color']),
        }}>
        <IconButton size='small' aria-label='Search' onClick={open}>
          <SearchIcon fontSize='small' />
        </IconButton>

        <Box sx={{ position: 'relative' }}>
          <InputBase
            value={value}
            onChange={handleChange}
            onFocus={open}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label='Search input'
            inputProps={{ 'data-qa': 'search-input' }}
            sx={{
              width: expanded ? maxWidth : 0,
              opacity: expanded ? 1 : 0,
              transition: (t) =>
                t.transitions.create(['width', 'opacity'], {
                  duration: t.transitions.duration.shorter,
                }),
              px: expanded ? 1 : 0,
              py: 0.5,
              border: expanded ? '1px solid' : '1px solid transparent',
              borderColor: expanded ? 'divider' : 'transparent',
              borderRadius: 1,
              fontSize: 13,
            }}
          />

          {expanded && value && (
            <IconButton
              size='small'
              aria-label='Clear search'
              onClick={clearValue}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 0,
                translate: '0 -50%',
                ml: -0.5,
              }}>
              <CloseIcon fontSize='small' />
            </IconButton>
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
}

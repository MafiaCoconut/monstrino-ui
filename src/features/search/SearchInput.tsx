"use client";

import React, { useState, useEffect, useCallback } from "react";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { SxProps, Theme } from "@mui/material/styles";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  sx?: SxProps<Theme>;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  sx,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  // Sync from parent (e.g. cleared externally)
  useEffect(() => {
    setLocal(value);
  }, [value]);

  // Debounced propagation
  useEffect(() => {
    if (local === value) return;
    const timer = setTimeout(() => onChange(local), debounceMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounceMs]);

  const handleClear = useCallback(() => {
    setLocal("");
    onChange("");
  }, [onChange]);

  return (
    <TextField
      size="small"
      fullWidth
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      placeholder={placeholder}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
            </InputAdornment>
          ),
          endAdornment: local ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={[
        {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: 2,
            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
            "&.Mui-focused fieldset": { borderColor: "primary.main" },
          },
          "& input": {
            fontSize: { xs: "0.875rem", sm: "0.9375rem" },
            color: "text.primary",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}

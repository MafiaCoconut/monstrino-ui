"use client";

import React from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  maxWidth?: number | string;
  sx?: SxProps<Theme>;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  maxWidth = 200,
  sx,
}: MultiSelectProps) {
  return (
    <FormControl
      size="small"
      sx={[{ minWidth: 120, maxWidth }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <InputLabel
        sx={{ fontSize: "0.8125rem" }}
        shrink={value.length > 0}
      >
        {label}
      </InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value as string[])}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {(selected as string[]).map((v) => (
              <Chip
                key={v}
                label={v}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.65rem",
                  backgroundColor: "rgba(139,92,246,0.2)",
                  color: "#A78BFA",
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "background.paper",
              border: "1px solid rgba(255,255,255,0.08)",
              maxHeight: 280,
            },
          },
        }}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.1)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.2)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "primary.main",
          },
          backgroundColor: "rgba(255,255,255,0.04)",
          fontSize: "0.8125rem",
          minHeight: 36,
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              fontSize: "0.8125rem",
              backgroundColor: value.includes(option)
                ? "rgba(139,92,246,0.12)"
                : undefined,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
              "&.Mui-selected": {
                backgroundColor: "rgba(139,92,246,0.15)",
                "&:hover": { backgroundColor: "rgba(139,92,246,0.2)" },
              },
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

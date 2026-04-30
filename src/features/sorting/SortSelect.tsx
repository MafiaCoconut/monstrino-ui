"use client";

import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type SortSelectOption = {
  value: string;
  label: string;
};

interface SortSelectProps {
  value: string;
  options: SortSelectOption[];
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
}

export function SortSelect({ value, options, onChange, sx }: SortSelectProps) {
  return (
    <FormControl
      size="small"
      sx={[{ minWidth: 140 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      <InputLabel sx={{ fontSize: "0.8125rem" }}>Sort By</InputLabel>
      <Select
        value={value}
        label="Sort By"
        onChange={(e) => onChange(String(e.target.value))}
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
          "& .MuiSelect-select": {
            py: { xs: 0.75, sm: 1 },
            fontSize: { xs: "0.8125rem", sm: "0.875rem" },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ fontSize: "0.875rem" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

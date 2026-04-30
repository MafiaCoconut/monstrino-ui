"use client";

import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

interface FavoriteButtonProps {
  isFavorited: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: "small" | "medium";
}

export function FavoriteButton({
  isFavorited,
  onToggle,
  size = "small",
}: FavoriteButtonProps) {
  return (
    <Tooltip
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      placement="top"
      arrow
    >
      <IconButton
        size={size}
        onClick={onToggle}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        sx={{
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
          color: isFavorited ? "#F43F5E" : "rgba(255,255,255,0.7)",
          transition: "color 0.2s, background-color 0.2s, transform 0.15s",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.75)",
            color: isFavorited ? "#FB7185" : "#F43F5E",
            transform: "scale(1.1)",
          },
          "& svg": { fontSize: size === "small" ? 16 : 20 },
        }}
      >
        {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}

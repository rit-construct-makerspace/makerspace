import React from "react";
import Privilege from "../../../types/Privilege";
import { Chip } from "@mui/material";

// MAKER -> Maker, LABBIE -> Labbie, etc.
export function makeSentenceCase(allCaps: string) {
  return allCaps.substring(0, 1) + allCaps.substring(1).toLocaleLowerCase();
}

interface PrivilegeChipProps {
  privilege: Privilege;
}

export default function PrivilegeChip({ privilege }: PrivilegeChipProps) {
  // Don't show a chip for makers
  if (privilege === Privilege.MAKER) return null;

  const label = makeSentenceCase(privilege);
  const color = privilege === Privilege.STAFF ? "primary" : "secondary";

  return <Chip label={label} variant="outlined" size="small" color={color} />;
}

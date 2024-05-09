"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("3f0b41a7-c0b0-4926-8b11-b6cb89b59950");
  }, []);

  return null;
};

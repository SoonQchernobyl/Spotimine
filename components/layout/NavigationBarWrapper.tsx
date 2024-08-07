"use client";

import React from "react";
import { usePathname } from "next/navigation";
import NavigationBar from "./NavigationBar";

const NavigationBarWrapper: React.FC = () => {
  const pathname = usePathname();
  const showNavBar = pathname !== "/" && pathname !== "/login";

  return showNavBar ? <NavigationBar /> : null;
};

export default NavigationBarWrapper;

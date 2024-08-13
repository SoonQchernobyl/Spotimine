"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Disc, Library } from "lucide-react";

const NavigationBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="navigation-bar">
      <Link href="/" className={pathname === "/" ? "active" : ""}>
        <Home />
        <span>Home</span>
      </Link>
      <Link
        href="/swipe/select-feature"
        className={pathname.startsWith("/swipe") ? "active" : ""}
      >
        <Disc />
        <span>Swipe</span>
      </Link>
      <Link
        href="/topSongs"
        className={pathname === "/topSongs" ? "active" : ""}
      >
        <Library />
        <span>Library</span>
      </Link>
    </nav>
  );
};

export default NavigationBar;

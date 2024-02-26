"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";

const pages = [
  { name: "Home", href: "/home" },
  { name: "Vigenere", href: "/vigenere" },
  { name: "Vigenere Extended", href: "/vigenere-ext" },
  { name: "Playfair", href: "/playfair" },
  { name: "Affine", href: "/affine" },
  { name: "About", href: "/about" },
];

const matchingPrefix = (path, prefix) =>
  path.startsWith(`${prefix}/`) || path === prefix;

export default function NavbarComponent({ className }) {
  const location = usePathname();
  const [active, setActive] = useState(false);

  return (
    <Navbar
      className={className}
      classNames={{
        wrapper: "max-w-screen-2xl md:px-8 lg:px-10 xl:px-12",
      }}>
      <NavbarContent>
        {pages.map((page) => (
          <Link
            key={page.name}
            href={page.href}
            aria-current={
              matchingPrefix(location, page.href) ? "page" : undefined
            }
            color={
              matchingPrefix(location, page.href) ? "primary" : "foreground"
            }
            as={NextLink}>
            <NavbarItem
              isActive={location
                .replace(/\/$/, "")
                .endsWith(page.href.replace(/\/$/, ""))}>
              {page.name}
            </NavbarItem>
          </Link>
        ))}
      </NavbarContent>
    </Navbar>
  );
}

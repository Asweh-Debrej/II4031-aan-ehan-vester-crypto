"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Button,
  DropdownTrigger,
} from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";

import { ChevronDown } from "@/lib/icons";

const pages = [
  { name: "Home", href: "/home" },
  {
    name: "Chiper",
    prefix: "/cipher",
    hrefs: [
      {
        name: "Vigenere",
        href: "/cipher/vigenere",
      },
      {
        name: "Vigenere Extended",
        href: "/cipher/vigenere-ext",
      },
      {
        name: "Playfair",
        href: "/cipher/playfair",
      },
      {
        name: "Affine",
        href: "/cipher/affine",
      },
      {
        name: "Vigenere Auto-Key",
        href: "/cipher/vigenere-auto-key",
      },
      {
        name: "Product",
        href: "/cipher/product",
      }
    ],
  },
  { name: "About", href: "/about" },
];

const matchingPrefix = (path, prefix) =>
  path.startsWith(`${prefix}/`) || path === prefix;

export default function NavbarComponent({ className }) {
  const location = usePathname();

  const renderDropdownButton = (page) => {
    const buttonClassName = `bg-transparent text-medium ${matchingPrefix(
      location,
      page.href
    ) && "text-primary font-bold"}`;

    return (<DropdownItem
      key={page.name}
      href={page.href}
      aria-current={
        matchingPrefix(location, page.href) ? "page" : undefined
      }
      as={NextLink}
      className={buttonClassName}>
      {page.name}
    </DropdownItem>);
  };

  const renderPage = (page) => {
    if (page.hrefs) {
      const dropdownClassName = `p-0 bg-transparent data-[hover=true]:bg-transparent text-medium ${matchingPrefix(
        location,
        page.prefix
      ) && "text-primary font-bold"}`;

      return (
        <Dropdown key={page.name}>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className={dropdownClassName}
                radius="sm"
                variant="light"
                color={
                  matchingPrefix(location, page.href) ? "primary" : "foreground"
                }
                endContent=<ChevronDown fill="currentColor" size={16} />>
                {page.name}
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu>
            {page.hrefs.map(renderDropdownButton)}
          </DropdownMenu>
        </Dropdown>
      );
    } else {
      return (
        <Link
          key={page.name}
          href={page.href}
          aria-current={
            matchingPrefix(location, page.href) ? "page" : undefined
          }
          color={matchingPrefix(location, page.href) ? "primary" : "foreground"}
          as={NextLink}>
          <NavbarItem
            isActive={location
              .replace(/\/$/, "")
              .endsWith(page.href.replace(/\/$/, ""))}>
            {page.name}
          </NavbarItem>
        </Link>
      );
    }
  };

  return (
    <Navbar
      className={className}
      classNames={{
        wrapper: "max-w-screen-2xl md:px-8 lg:px-10 xl:px-12",
      }}>
      <NavbarContent>{pages.map((page) => renderPage(page))}</NavbarContent>
    </Navbar>
  );
}

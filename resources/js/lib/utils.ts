import type { InertiaLinkProps } from "@inertiajs/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type InertiaHref = NonNullable<InertiaLinkProps["href"]>;

export function toUrl(href: string | URL | InertiaHref): string {
  if (typeof href === "string") return href;
  if (href instanceof URL) return href.toString();
  if (href && typeof href === "object") {
    if ("url" in href && typeof href.url === "string") return href.url;
    if ("href" in href && typeof href.href === "string") return href.href;
  }
  return String(href);
}

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/Button";

const links = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Integrations", href: "#integrations" },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-fg-subtle transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="hidden rounded-pill px-4 py-2 text-sm text-fg-muted transition-colors hover:text-fg sm:inline-flex"
          >
            Sign in
          </Link>
          <Link href="/auth" className={buttonClasses("primary", "sm")}>
            Get Started Free
          </Link>
        </div>
      </div>
    </header>
  );
}

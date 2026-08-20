"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/pipeline", label: "Pipeline" },
  { href: "/contatos", label: "Contatos" },
];

export default function Sidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sidebar">
      <div className="brand">CRM Vendas</div>
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link${active ? " active" : ""}`}
          >
            {l.label}
          </Link>
        );
      })}
      <div className="spacer" />
      <div className="user-box">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
        <button className="btn btn-sm" style={{ width: "100%" }} onClick={logout}>
          Sair
        </button>
      </div>
    </aside>
  );
}

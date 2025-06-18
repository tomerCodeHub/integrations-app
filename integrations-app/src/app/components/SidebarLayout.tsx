"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (profile?.username) {
        setUsername(profile.username);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const inIntegrations = pathname?.startsWith("/integrations");

  return (
    <div className="drawer lg:drawer-open">
      <input id="app-drawer" type="checkbox" className="drawer-toggle peer" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile navbar */}
        <div className="w-full navbar bg-base-100 lg:hidden px-4 shadow-sm">
          <label
            htmlFor="app-drawer"
            className="btn btn-square btn-ghost peer-checked:hidden"
          >
            ☰
          </label>
          <label
            htmlFor="app-drawer"
            className="btn btn-square btn-ghost hidden peer-checked:block"
          >
            ✕
          </label>
          <div className="flex-1 font-bold text-lg">Integrations App</div>
        </div>

        <main className="p-6">{children}</main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <aside className="w-64 min-h-full bg-base-200 p-4 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-bold mb-4">Integrations</h1>

            <div className="mb-6 text-sm">
              <p className="text-gray-500">Signed in as:</p>
              <p className="font-semibold truncate">{username || email}</p>
            </div>

            <nav className="space-y-2">
              <Link
                href={inIntegrations ? "/create-integration" : "/integrations"}
                className={`btn btn-sm btn-block text-white ${
                  inIntegrations
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                {inIntegrations ? "Create Integration" : "All Integrations"}
              </Link>

              <Link
                href="/profile"
                className={`btn btn-sm btn-block text-white ${
                  pathname === "/profile"
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Logout at bottom */}
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-error btn-block"
            >
              Logout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

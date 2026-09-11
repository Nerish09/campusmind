import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/dashboard/courses" },
  { label: "Assignments", href: "/dashboard/assignments" },
  { label: "Study", href: "/dashboard/study" },
  { label: "AI Assistant", href: "/dashboard/ai" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h2>CampusMind</h2>
        <p className="sidebar-label">STUDENT OS</p>
      </div>

      <nav>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="sidebar-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
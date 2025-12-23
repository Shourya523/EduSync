import {
  Coffee,
  Bell,
  Briefcase,
  HelpCircle,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UtilitySidebar() {
  const pathname = usePathname();

  const items = [
    { label: "JCafe", href: "/jcafe", icon: Coffee },
    { label: "Announcements", href: "/announcements", icon: Bell },
    { label: "Buy & Sell", href: "/market", icon: ShoppingCart },
    { label: "Essential Services", href: "/essentialServices", icon: Briefcase },
    { label: "Help", href: "/help", icon: HelpCircle },
  ];

  return (
    <nav className="sidebar-nav">
      <ul>
        {items.map(({ label, href, icon: Icon }) => (
          <li key={href} className={pathname === href ? "active" : ""}>
            <Link href={href}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, History, Plane, Building2, User2, Wrench, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const labels = [
  { title: "Viajes", icon: Plane },
  { title: "Hogar", icon: Building2 },
  { title: "Personal", icon: User2 },
  { title: "Servicios", icon: Wrench },
];

const mainMenuItems = [
  { title: "Inicio", icon: Home, path: "/" },
  { title: "Historial", icon: History, path: "/history" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/5 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mi Finanzas</h2>
        <ThemeToggle />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Labels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {labels.map((label) => (
                <SidebarMenuItem key={label.title}>
                  <SidebarMenuButton tooltip={label.title}>
                    <label.icon className="h-4 w-4" />
                    <span>{label.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="outline"
                  className="text-muted-foreground"
                  tooltip="Agregar Label"
                >
                  <Plus className="h-4 w-4" />
                  <span>Agregar más labels</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

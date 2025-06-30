"use client";

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Inbox,
  MessageCircleCode,
  Plus,
  Projector,
  Search,
  Settings,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

import { StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const supportAdminId = "support_admin";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export const AppSidebar = () => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [supportChannels, setSupportChannels] = useState<any[]>([]);
  const [isSupportOpen, setIsSupportOpen] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!apiKey || !supportAdminId) return;

      const client = StreamChat.getInstance(apiKey);
      const res = await fetch(`/api/token?user_id=${supportAdminId}`);
      const { token } = await res.json();

      await client.connectUser({ id: supportAdminId, name: "Support Admin" }, token);
      setChatClient(client);

      const channels = await client.queryChannels({
        type: "messaging",
        members: { $in: [supportAdminId] },
      });

      setSupportChannels(channels);
    };

    init();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/logo.svg" alt="logo" width={20} height={20} />
                <span>Lama Dev</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.title === "Inbox" && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsSupportOpen(!isSupportOpen)}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <MessageCircleCode />
                      <span>Support Chat</span>
                    </div>
                    {isSupportOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </SidebarMenuButton>

                {isSupportOpen && supportChannels.length > 0 && (
                  <SidebarMenu className="ml-6 mt-2">
                    {supportChannels.map((channel) => {
                      const user = Object.values(channel.state.members).find(
                        (m: any) => m?.user?.id && m.user.id !== supportAdminId
                      ) as { user?: { id?: string; name?: string } } | undefined;
                      return (
                        <SidebarMenuItem key={channel.id}>
                          <SidebarMenuButton asChild>
                            <Link href={`/chat/${channel.id}`}>
                              <span>{user?.user?.name || user?.user?.id || "Unknown User"}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus />
            <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Projector />
                    See All Projects
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Plus />
                    Add Project
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Admin <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Setting</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

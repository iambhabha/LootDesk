"use client";

import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  MessageCircle,
  Search,
  Settings,
  Swords,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import SidebarSkeleton from "../components/SidebarSkeleton";
import SidebarUserItem from "../components/SidebarUserItem";

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
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

import { Channel, StreamChat } from "stream-chat";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const supportAdminId = "support_admin";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Add Tournament", url: "/tournaments", icon: Swords },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
];

export default function AppSidebar() {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [supportChannels, setSupportChannels] = useState<Channel[]>([]);
  const [unreadMap, setUnreadMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [readChannels, setReadChannels] = useState<Record<string, boolean>>({});

  const refreshChannels = useCallback(async (client: StreamChat) => {
    try {
      const channels = await client.queryChannels(
        { type: "messaging", members: { $in: [supportAdminId] } },
        { last_message_at: -1 },
        { watch: true, state: true }
      );

      const unreadFlags: Record<string, boolean> = {};

      for (const channel of channels) {
        const lastMessageAt = channel.state.last_message_at;
        const readAt = channel.state.read?.[supportAdminId]?.last_read;

        if (typeof channel.id === "string") {
          unreadFlags[channel.id] =
            !!lastMessageAt &&
            (!readAt || new Date(readAt) < new Date(lastMessageAt));
        }
      }

      setSupportChannels(channels);
      setUnreadMap(unreadFlags);
    } catch (err) {
      console.error("Failed to fetch channels", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let clientInstance: StreamChat | null = null;

    const initChat = async () => {
      try {
        const client = StreamChat.getInstance(apiKey);
        clientInstance = client;

        // Fetch the token
        const res = await fetch(`/api/token?user_id=${supportAdminId}`);

        // Check if the response is okay
        if (!res.ok) {
          throw new Error(`Failed to fetch token, status: ${res.status}`);
        }

        // Log the response for debugging
        const responseBody = await res.text(); // Get the raw text response
        console.log("Response from token API:", responseBody);

        // Attempt to parse JSON if the response is valid
        let jsonResponse;
        try {
          jsonResponse = JSON.parse(responseBody);
        } catch (error) {
          throw new Error("Invalid JSON in the response: " + responseBody);
        }

        // If token exists, proceed to connect user
        const { token } = jsonResponse;
        if (!token) {
          throw new Error("Token not found in the response");
        }

        // Connect user
        await client.connectUser(
          { id: supportAdminId, name: "Support Admin" },
          token
        );

        setChatClient(client);
        await refreshChannels(client);

        const handleEvent = () => refreshChannels(client);
        client.on("message.new", handleEvent);
        client.on("channel.updated", handleEvent);
        client.on("channel.deleted", handleEvent);
        client.on("notification.added_to_channel", handleEvent);

        (client as any)._supportHandler = handleEvent;
      } catch (err) {
        console.error("Error initializing Stream", err);
      }
    };

    initChat();

    return () => {
      if (clientInstance) {
        const handleEvent = (clientInstance as any)._supportHandler;
        if (handleEvent) {
          clientInstance.off("message.new", handleEvent);
          clientInstance.off("channel.updated", handleEvent);
          clientInstance.off("channel.deleted", handleEvent);
          clientInstance.off("notification.added_to_channel", handleEvent);
        }
        clientInstance.disconnectUser();
      }
    };
  }, [refreshChannels]);

  const handleChatClick = async (channel: Channel) => {
    // Mark the current channel as read when opened
    if (typeof channel.id === "string" && !readChannels[channel.id]) {
      await channel.markRead(); // Marks the channel as read
      setReadChannels((prevState) => ({
        ...prevState,
        [String(channel.id)]: true, // Use the channel's ID as the key
      }));
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Image src="/logo.jpg" alt="logo" width={20} height={20} />
                <span>Support Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportChannels.length > 0 && ( // Only show Support Chats if there are channels
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setIsSupportOpen(!isSupportOpen)}
                  >
                    <div className="flex items-center justify-between w-full cursor-pointer">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        <span>Support Chats</span>
                        {supportChannels.filter(
                          (channel) => unreadMap[String(channel.id)]
                        ).length > 0 && (
                          <span className="text-xs bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {
                              supportChannels.filter(
                                (channel) => unreadMap[String(channel.id)]
                              ).length
                            }
                          </span>
                        )}
                      </div>
                      {isSupportOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </SidebarMenuButton>

                  {isSupportOpen && (
                    <div className="ml-6 mt-2 max-h-[300px] overflow-y-auto">
                      {isLoading ? (
                        <SidebarSkeleton />
                      ) : supportChannels.length > 0 ? (
                        supportChannels.map((channel) => (
                          <SidebarUserItem
                            key={channel.id}
                            channel={channel}
                            supportAdminId={supportAdminId}
                            hasUnread={unreadMap[String(channel.id)] ?? false}
                            onClick={() => handleChatClick(channel)} // Pass the async function
                          />
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 px-2 py-1">
                          No active support chats
                        </div>
                      )}
                    </div>
                  )}
                </SidebarMenuItem>
              )}
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
                  <User2 size={16} /> Admin
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

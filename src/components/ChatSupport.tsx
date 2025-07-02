"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import TypingIndicator from "./TypingIndicator";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const userId = "support_admin"; // Admin ID
const userName = "Support Admin";

export default function ChatPage() {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const client = StreamChat.getInstance(apiKey);
        const res = await fetch(`/api/token?user_id=${userId}`);
        const json = await res.json();
        const token = json.token;

        await client.connectUser({ id: userId, name: userName }, token);

        // Fetch channels like support_user123, support_user456
        const filter = { type: "messaging" };
        const result = await client.queryChannels(filter);
        const supportChannels = result.filter(
          (channel) =>
            typeof channel.id === "string" && channel.id.startsWith("support_")
        );
        setChannels(supportChannels);

        setActiveChannel(result[0]); // auto-select first
        setChatClient(client);
      } catch (err) {
        console.error("Init error:", err);
      }
    }

    init();

    return () => {
      chatClient?.disconnectUser();
    };
  }, []);

  if (!chatClient || !activeChannel) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-white">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar - Channel list */}
      <div className="w-1/4 bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Support Chats
        </h2>
        <ul>
          {channels.map((channel) => {
            const user = channel.state?.members.find(
              (m: any) => m.user?.id !== userId
            )?.user;
            return (
              <li
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  activeChannel?.id === channel.id
                    ? "bg-gray-300 dark:bg-gray-800"
                    : ""
                }`}
              >
                <p className="font-medium dark:text-white">
                  {user?.name ?? "Unknown User"}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {channel.state.messages?.slice(-1)[0]?.text ??
                    "No messages yet"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-white dark:bg-black">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={activeChannel}>
            <Window>
              <TypingIndicator show={true} />
              <ChannelHeader />
              <MessageList />

              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
}

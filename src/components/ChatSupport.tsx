"use client";

import { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  MessageSimple,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const userId = "user123"; // Use support agent's id if it's agent side
const userName = "Kapil";

export default function ChatPage() {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channelLoaded, setChannelLoaded] = useState(false);

  useEffect(() => {
    async function initChat() {
      try {
        const client = StreamChat.getInstance(apiKey);

        // Token fetch
      const res = await fetch(`/api/token?user_id=${userId}`);
      const json = await res.json();
      console.log("Token response:", json);

      const token = json.token;

        await client.connectUser(
          {
            id: userId,
            name: userName,
          },
          token
        );

        const channel = client.channel("messaging", "support-room", {
          name: "Support Room",
          members: ["user123", "support_agent_1"],
        } as any);

        await channel.watch();
        setChatClient(client);
        setChannelLoaded(true);
      } catch (err) {
        console.error("Chat Init Error:", err);
      }
    }

    initChat();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, []);

  if (!chatClient || !channelLoaded) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-white">
        Loading chat...
      </div>
    );
  }

  const channel = chatClient.channel("messaging", "support-room");

  return (
    <div className="flex h-screen">
      {/* Optional sidebar or left pane here */}
      <div className="flex-1 bg-white dark:bg-black">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader title="Support Chat" live />
              <MessageList Message={MessageSimple} />
              <MessageInput focus />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  ChannelHeader,
  Window,
  Thread,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const supportAdminId = "support_admin";

export default function ChatViewPage() {
  const { channelId } = useParams();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const chatClient = StreamChat.getInstance(apiKey);
        const res = await fetch(`/api/token?user_id=${supportAdminId}`);
        const { token } = await res.json();

        await chatClient.connectUser({ id: supportAdminId, name: "Support Admin" }, token);
        const supportChannel = chatClient.channel("messaging", channelId as string);
        await supportChannel.watch();

        setClient(chatClient);
        setChannel(supportChannel);
      } catch (err) {
        console.error("Error initializing chat:", err);
      }
    };

    init();

    return () => {
      client?.disconnectUser();
    };
  }, [channelId]);

  if (!client || !channel) {
    return (
      <div className="flex h-screen items-center justify-center bg-background dark:bg-black px-4">
        <div className="w-full max-w-md space-y-6 animate-pulse">
          {/* Chat Header */}
          <div className="h-6 bg-muted rounded w-2/3" />

          {/* Message Bubbles */}
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-muted h-4 w-3/5 rounded" />
            </div>
          </div>

          {/* Input Field */}
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    );
  }




  return (
    <div className="h-[calc(100vh-56px)] max-h-[calc(95vh-56px)] overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      <Chat client={client} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>

    </div>
  );
}

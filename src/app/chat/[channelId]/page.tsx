"use client";

import ChatShimmer from "@/components/ChatShimmer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Channel as StreamChannel } from "stream-chat";
import { StreamChat } from "stream-chat";
import {
  Channel as ChannelComponent,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  TypingIndicator,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const supportAdminId = "support_admin";

export default function ChatViewPage() {
  const params = useParams();
  const channelId = params?.channelId as string | undefined;
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const chatClient = StreamChat.getInstance(apiKey);
        const res = await fetch(`/api/token?user_id=${supportAdminId}`);
        const { token } = await res.json();

        await chatClient.connectUser(
          { id: supportAdminId, name: "Support Admin" },
          token
        );
        const supportChannel = chatClient.channel(
          "messaging",
          channelId as string
        );
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
    return <ChatShimmer />; // Show shimmer loader when loading data
  }

  return (
    <div className="h-[calc(100vh-56px)] max-h-[calc(95vh-56px)] overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      <Chat client={client} theme="str-chat__theme-dark">
        <ChannelComponent channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <TypingIndicator />
            <MessageInput focus />
          </Window>
          <Thread />
        </ChannelComponent>
      </Chat>
    </div>
  );
}

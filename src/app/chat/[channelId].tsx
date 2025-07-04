"use client";

import { useParams } from "next/navigation";
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

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const supportAdminId = "support_admin";

export default function ChatView() {
  const params = useParams();
  const channelId = params?.channelId as string;

  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const chatClient = StreamChat.getInstance(apiKey);
        const res = await fetch(`/api/token?user_id=${supportAdminId}`);
        const { token } = await res.json();

        await chatClient.connectUser(
          { id: supportAdminId, name: "Support Admin" },
          token
        );

        const supportChannel = chatClient.channel("messaging", channelId);
        await supportChannel.watch();

        setClient(chatClient);
        setChannel(supportChannel);
      } catch (err) {
        console.error("Chat init error:", err);
      }
    }

    init();
    return () => {
      client?.disconnectUser();
    };
  }, [channelId]);

  if (!client || !channel) {
    return <div className="p-6 text-center text-muted">Loading chat...</div>;
  }

  return (
    <div className="h-screen bg-background text-foreground">
      <Chat client={client} theme="messaging light">
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const adminId = "support_admin";

export default function ChatPage() {
  const router = useRouter();
  const { channelId } = router.query;

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!channelId) return;

    const init = async () => {
      const client = StreamChat.getInstance(apiKey);
      const res = await fetch(`/api/token?user_id=${adminId}`);
      const { token } = await res.json();

      await client.connectUser({ id: adminId, name: "Support Admin" }, token);

      const channel = client.channel("messaging", channelId as string);
      await channel.watch();
      setChannel(channel);
      setChatClient(client);
    };

    init();

    return () => {
      if (chatClient) chatClient.disconnectUser();
    };
  }, [channelId]);

  if (!chatClient || !channel) {
    return <div className="p-6 text-center text-gray-500">Loading chat...</div>;
  }

  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

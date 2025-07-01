"use client";

import { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  ChannelHeader,
  Window,
  Thread,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = 'dukn7eu68wzr'; // Replace with your Stream API Key
const supportAdminId = "support_admin"; // Must be 'admin' role or member of the channel
const supportUserId = "kapil_user"; // ID of the user you're chatting with
const channelId = `support_${supportUserId}`;

export default function ChatPage() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const chatClient = StreamChat.getInstance(apiKey);

        // Fetch token from your API route
        const res = await fetch(`/api/token?user_id=${supportAdminId}`);
        const { token } = await res.json();

        // Connect support admin user
        await chatClient.connectUser(
          { id: supportAdminId, name: "Support Admin" },
          token
        );

        // Create or watch existing support channel
        const supportChannel = chatClient.channel("messaging", channelId, {
          name: "Support Chat with Kapil",
          members: [supportAdminId, supportUserId],
        });

        supportChannel.watch();

        setClient(chatClient);
        setChannel(supportChannel);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
      }
    }

    init();

    return () => {
      client?.disconnectUser();
    };
  }, []);

  if (!client || !channel) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-white">
        Loading chat...
      </div>
    );
  }

  return (
    <Chat client={client} theme="messaging dark">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput focus />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

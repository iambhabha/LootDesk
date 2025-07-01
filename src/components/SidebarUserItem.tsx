import Link from "next/link";
import { Channel } from "stream-chat";

type Props = {
  channel: Channel;
  supportAdminId: string;
  hasUnread: boolean;
  onClick: () => Promise<void>; // onClick should be async since handleChatClick is async
};

export default function SidebarUserItem({
  channel,
  supportAdminId,
  hasUnread,
  onClick,
}: Props) {
  const otherMember = Object.values(channel.state.members).find(
    (m) => m.user?.id !== supportAdminId
  );

  const userName = otherMember?.user?.name || "Unknown User";
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];
  const lastMessageText = lastMessage?.text || "No messages yet";

  return (
    <Link
      href={`/chat/${channel.id}`}
      onClick={(e) => {
        e.preventDefault(); // Prevent immediate navigation to handle "read" logic
        onClick(); // Mark as read before navigating
        setTimeout(() => {
          // Navigate after state update
          window.location.href = `/chat/${channel.id}`;
        }, 100);
      }}
      className="flex justify-between items-center rounded-md hover:bg-accent px-2 py-1 text-sm text-left transition-colors group cursor-pointer"
    >
      <div className="flex flex-col">
        <span
          className={`font-medium ${hasUnread ? "text-white font-bold" : ""}`}
        >
          {userName}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
          {lastMessageText}
        </span>
      </div>

      {hasUnread && <span className="ml-2 w-2 h-2 rounded-full bg-red-500" />}
    </Link>
  );
}

import Link from "next/link";
import { Channel } from "stream-chat";

type Props = {
    channel: Channel;
    supportAdminId: string;
};

export default function SidebarUserItem({ channel, supportAdminId }: Props) {
    const members = Object.values(channel.state.members);
    const other = members.find(m => m.user?.id !== supportAdminId)?.user;

    const lastMessage = channel.state.messages?.[channel.state.messages.length - 1];
    const text = lastMessage?.text || "No messages yet";
    const sender = lastMessage?.user?.name || lastMessage?.user?.id || "Unknown";
    const shortText = text.length > 30 ? `${text.slice(0, 30)}...` : text;

    return (
        <div className="ml-4 mb-2">
            <Link href={`/chat/${channel.id}`} className="block px-2 py-1 hover:bg-muted rounded">
                <div className="font-medium">{other?.name || other?.id || "Unknown User"}</div>
                <div className="text-xs text-muted-foreground truncate">{`${sender}: ${shortText}`}</div>
            </Link>
        </div>
    );
}

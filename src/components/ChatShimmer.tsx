const MessageBubbleShimmer = ({ align = "left" }) => (
  <div
    className={`flex ${
      align === "right" ? "justify-end" : "justify-start"
    } w-full`}
  >
    <div
      className={`space-y-2 py-1 ${
        align === "right" ? "mr-4" : "ml-4"
      } max-w-[70%]`}
    >
      {/* Sender Name shimmer */}
      <div className="h-2 bg-gray-700 rounded w-32"></div>
      {/* Message text shimmer */}
      <div className="h-3 bg-gray-700 rounded w-48"></div>
      {/* Timestamp shimmer */}
      <div className="h-2 bg-gray-700 rounded w-24"></div>
    </div>
  </div>
);

const ChatShimmer = () => (
  <div className="space-y-4 p-4 w-full">
    {/* Shimmer Header */}
    <div className="w-full h-12 flex items-center space-x-3 bg-gray-800 animate-pulse rounded-md p-3 mt-4">
      <div className="w-10 h-10 rounded-full bg-gray-700"></div>
      <div className="flex-1 h-6 bg-gray-700 rounded-md"></div>
    </div>

    {/* Shimmer Messages */}
    <div className="space-y-3 w-full">
      {/* Left-aligned message */}
      <MessageBubbleShimmer align="left" />
      {/* Right-aligned message */}
      <MessageBubbleShimmer align="right" />
      <MessageBubbleShimmer align="right" />
      {/* Left-aligned message */}
      <MessageBubbleShimmer align="left" />
      <MessageBubbleShimmer align="left" />
      <MessageBubbleShimmer align="left" />
      {/* Right-aligned message */}
      <MessageBubbleShimmer align="right" />
      <MessageBubbleShimmer align="left" />
      <MessageBubbleShimmer align="right" />
      <MessageBubbleShimmer align="left" />
      <MessageBubbleShimmer align="right" />
      <MessageBubbleShimmer align="right" />
      {/* Left-aligned message */}

      <MessageBubbleShimmer align="left" />
      <MessageBubbleShimmer align="left" />
      {/* Right-aligned message */}
      <MessageBubbleShimmer align="right" />
      {/* Left-aligned message */}
      <MessageBubbleShimmer align="left" />
    </div>

    {/* Shimmer Input Area */}
    <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md mb-4"></div>
  </div>
);

export default ChatShimmer;

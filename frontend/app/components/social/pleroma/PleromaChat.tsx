import { useState } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaSmile, FaImage } from "react-icons/fa";
import { PleromaActivityHandler } from "~/services/activitypub/handlers/pleroma.server";
import EmojiPicker from '~/components/common/EmojiPicker';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  emojis: string[];
  mentions: string[];
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const messages = await db.chatMessage.findMany({
    where: {
      OR: [
        { senderId: params.userId },
        { recipientIds: { has: params.userId } }
      ]
    },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });

  return json({ messages });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, recipientId, content } = Object.fromEntries(formData);

  const pleromaHandler = new PleromaActivityHandler(
    process.env.DOMAIN!,
    new FederationService(process.env.DOMAIN!, process.env.PRIVATE_KEY!, process.env.PUBLIC_KEY!)
  );

  if (action === "sendMessage") {
    await pleromaHandler.sendChatMessage(recipientId as string, content as string);
  }

  return json({ success: true });
};

export function PleromaChat() {
  const { messages } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    fetcher.submit(
      {
        action: "sendMessage",
        content: newMessage,
        recipientId: "target-user-id", // Replace with actual recipient
      },
      { method: "post" }
    );

    setNewMessage("");
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-start gap-3 ${
                message.senderId === "current-user-id" ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-8 h-8 rounded-full"
              />
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId === "current-user-id"
                    ? "bg-purple-500/20"
                    : "bg-white/5"
                }`}
              >
                <div className="text-sm font-semibold mb-1">
                  {message.senderName}
                </div>
                <p className="break-words">{message.content}</p>
                {message.emojis.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {message.emojis.map((emoji) => (
                      <span key={emoji}>{emoji}</span>
                    ))}
                  </div>
                )}
                <div className="text-xs opacity-60 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-white/10 rounded-lg"
          >
            <FaSmile />
          </button>
          <button className="p-2 hover:bg-white/10 rounded-lg">
            <FaImage />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 rounded-lg px-4 py-2"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-lg"
          >
            <FaPaperPlane />
          </button>
        </div>

        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-2"
            >
              <EmojiPicker
                onSelect={(emoji) => {
                  setNewMessage((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

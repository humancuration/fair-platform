import { db } from "~/utils/db.server";
import type { PleromaPost, ActivityPubActivity } from "~/types/activitypub";
import { FederationService } from "../federation.server";

interface PleromaReaction {
  type: "EmojiReact";
  content: string;
  actor: string;
  object: string;
  tag?: Array<{
    type: "Emoji";
    name: string;
    icon: {
      type: "Image";
      url: string;
    };
  }>;
}

interface PleromaChatMessage {
  type: "ChatMessage";
  content: string;
  actor: string;
  to: string[];
  tag?: Array<{
    type: "Emoji" | "Mention";
    name: string;
    href?: string;
  }>;
}

export class PleromaActivityHandler {
  constructor(
    private domain: string,
    private federationService: FederationService
  ) {}

  async handleEmojiReaction(activity: ActivityPubActivity & PleromaReaction): Promise<void> {
    const { actor, object: targetId, content: emoji } = activity;

    await db.reaction.upsert({
      where: {
        actorId_targetId_emoji: {
          actorId: actor,
          targetId,
          emoji,
        },
      },
      create: {
        actorId: actor,
        targetId,
        emoji,
        federatedFrom: new URL(actor).hostname,
      },
      update: {},
    });

    // Federate to other instances if needed
    await this.federationService.federateActivity(activity);
  }

  async handleChatMessage(activity: ActivityPubActivity & PleromaChatMessage): Promise<void> {
    const { actor, content, to, tag } = activity;

    // Store chat message
    await db.chatMessage.create({
      data: {
        content,
        senderId: actor,
        recipientIds: to,
        mentions: tag?.filter(t => t.type === "Mention").map(t => t.href) || [],
        emojis: tag?.filter(t => t.type === "Emoji").map(t => t.name) || [],
        federatedFrom: new URL(actor).hostname,
      },
    });

    // Notify recipients
    for (const recipientId of to) {
      await db.notification.create({
        data: {
          type: 'chat',
          userId: recipientId,
          actorId: actor,
          content,
          read: false,
        },
      });
    }
  }

  async createEmojiReaction(targetId: string, emoji: string): Promise<void> {
    const actor = await this.federationService.getLocalActor();
    
    const activity: ActivityPubActivity & PleromaReaction = {
      "@context": ["https://www.w3.org/ns/activitystreams"],
      id: `${this.domain}/activities/${crypto.randomUUID()}`,
      type: "EmojiReact",
      actor: actor.id,
      object: targetId,
      content: emoji,
      published: new Date().toISOString(),
      to: ["https://www.w3.org/ns/activitystreams#Public"],
      tag: [{
        type: "Emoji",
        name: emoji,
        icon: {
          type: "Image",
          url: `${this.domain}/emoji/${emoji}.png`
        }
      }],
    };

    // Store locally
    await db.reaction.create({
      data: {
        actorId: actor.id,
        targetId,
        emoji,
        local: true,
      },
    });

    // Federate
    await this.federationService.federateActivity(activity);
  }

  async sendChatMessage(recipientId: string, content: string): Promise<void> {
    const actor = await this.federationService.getLocalActor();
    
    const activity: ActivityPubActivity & PleromaChatMessage = {
      "@context": ["https://www.w3.org/ns/activitystreams"],
      id: `${this.domain}/activities/${crypto.randomUUID()}`,
      type: "ChatMessage",
      actor: actor.id,
      content,
      published: new Date().toISOString(),
      to: [recipientId],
    };

    // Store locally
    await db.chatMessage.create({
      data: {
        content,
        senderId: actor.id,
        recipientIds: [recipientId],
        local: true,
      },
    });

    // Send to recipient's inbox
    const inbox = await this.federationService.discoverInbox(recipientId);
    if (inbox) {
      await this.federationService.deliverToInbox(inbox, activity);
    }
  }

  // Handle Pleroma-specific extensions to posts
  async enhancePost(post: PleromaPost): Promise<PleromaPost> {
    // Add custom emoji support
    const customEmojis = await db.customEmoji.findMany({
      where: { enabled: true },
    });

    return {
      ...post,
      tag: [
        ...(post.tag || []),
        ...customEmojis.map(emoji => ({
          type: "Emoji",
          name: emoji.shortcode,
          icon: {
            type: "Image",
            url: emoji.url,
          },
        })),
      ],
      // Add other Pleroma-specific extensions
      pleroma: {
        ...post.pleroma,
        content_type: "text/markdown",
        local: true,
        conversation_id: crypto.randomUUID(),
        direct_conversation_id: post.to.length === 1 ? crypto.randomUUID() : undefined,
        emoji_reactions: [],
        thread_muted: false,
        pinned: false,
      },
    };
  }
}

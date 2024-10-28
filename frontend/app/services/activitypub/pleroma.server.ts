import { db } from "~/utils/db.server";
import type { PleromaPost } from "~/types/activitypub";
import { FederationService } from "./federation.server";

export class PleromaService {
  constructor(
    private domain: string,
    private federationService: FederationService
  ) {}

  async handleIncomingPost(post: PleromaPost): Promise<void> {
    // Convert Pleroma format to our internal format
    const internalPost = {
      id: post.id,
      content: post.pleroma.content["text/markdown"] || post.pleroma.content["text/plain"],
      contentHtml: post.pleroma.content["text/html"],
      authorId: post.attributedTo,
      federatedFrom: new URL(post.attributedTo).hostname,
      conversationId: post.pleroma.conversation_id,
      reactions: post.pleroma.emoji_reactions?.map(reaction => ({
        name: reaction.name,
        count: reaction.count,
        userReacted: reaction.me,
      })),
      visibility: this.convertVisibility(post),
      tags: post.tag?.map(t => t.name.replace('#', '')) || [],
      createdAt: new Date(post.published),
      federationData: {
        originalId: post.id,
        protocol: 'pleroma',
        raw: post,
      },
    };

    // Store in our database
    await db.post.create({
      data: internalPost,
    });

    // Federate to other instances if public
    if (post.to.includes('https://www.w3.org/ns/activitystreams#Public')) {
      await this.federationService.federateActivity({
        type: 'Create',
        actor: post.attributedTo,
        object: post,
        published: post.published,
        to: post.to,
        cc: post.cc,
        attributedTo: post.attributedTo,
      });
    }
  }

  async createPost(content: string, options: {
    visibility?: 'public' | 'unlisted' | 'private' | 'direct';
    replyTo?: string;
    contentWarning?: string;
    attachments?: Array<{ id: string; description?: string }>;
    poll?: {
      options: string[];
      expiresIn?: number;
      multiple?: boolean;
    };
  } = {}): Promise<PleromaPost> {
    const post = {
      "@context": [
        "https://www.w3.org/ns/activitystreams",
        "http://pleroma.social/schemas/v1"
      ],
      type: "Note",
      content: {
        "text/plain": content,
        "text/html": this.convertToHtml(content),
        "text/markdown": content,
      },
      published: new Date().toISOString(),
      to: this.getVisibilityAddresses(options.visibility || 'public'),
      sensitive: Boolean(options.contentWarning),
      summary: options.contentWarning || "",
      attachment: options.attachments,
      ...(options.poll && {
        quizType: "multiple",
        oneOf: options.poll.options.map(text => ({
          type: "Note",
          name: text,
        })),
        endTime: options.poll.expiresIn 
          ? new Date(Date.now() + options.poll.expiresIn * 1000).toISOString()
          : undefined,
      }),
      ...(options.replyTo && { inReplyTo: options.replyTo }),
    };

    // Send to Pleroma instance
    const response = await fetch(`https://${this.domain}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/activity+json',
        'Authorization': `Bearer ${process.env.PLEROMA_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error(`Failed to create Pleroma post: ${await response.text()}`);
    }

    return response.json();
  }

  private convertVisibility(post: PleromaPost): 'public' | 'unlisted' | 'private' | 'direct' {
    if (post.to.includes('https://www.w3.org/ns/activitystreams#Public')) {
      return post.cc?.includes(`${this.domain}/followers`) ? 'unlisted' : 'public';
    }
    return post.to.length === 1 ? 'direct' : 'private';
  }

  private getVisibilityAddresses(visibility: string): string[] {
    switch (visibility) {
      case 'public':
        return [
          'https://www.w3.org/ns/activitystreams#Public',
          `${this.domain}/followers`,
        ];
      case 'unlisted':
        return [
          'https://www.w3.org/ns/activitystreams#Public',
        ];
      case 'private':
        return [
          `${this.domain}/followers`,
        ];
      case 'direct':
        return []; // Recipients will be added based on mentions
      default:
        return ['https://www.w3.org/ns/activitystreams#Public'];
    }
  }

  private convertToHtml(markdown: string): string {
    // Convert markdown to HTML - you can use a library like marked
    // This is a simple example
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
}

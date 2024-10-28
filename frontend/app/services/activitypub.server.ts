import { sign } from 'http-signature';
import { db } from "~/utils/db.server";
import type { ActivityPubActor, ActivityPubActivity, PleromaPost } from "~/types/activitypub";

export class ActivityPubService {
  private domain: string;
  private privateKey: string;

  constructor(domain: string, privateKey: string) {
    this.domain = domain;
    this.privateKey = privateKey;
  }

  async createForumPost(content: string, tags: string[] = [], inReplyTo?: string): Promise<ActivityPubActivity> {
    const actor = await this.getLocalActor();
    const object: ActivityPubObject = {
      "@context": ["https://www.w3.org/ns/activitystreams"],
      id: `${this.domain}/objects/${crypto.randomUUID()}`,
      type: "Note",
      attributedTo: actor.id,
      content,
      published: new Date().toISOString(),
      to: ["https://www.w3.org/ns/activitystreams#Public"],
      tag: tags.map(tag => ({
        type: "Hashtag",
        href: `${this.domain}/tags/${tag}`,
        name: `#${tag}`
      })),
      ...(inReplyTo && { inReplyTo })
    };

    const activity: ActivityPubActivity = {
      "@context": ["https://www.w3.org/ns/activitystreams"],
      id: `${this.domain}/activities/${crypto.randomUUID()}`,
      type: "Create",
      actor: actor.id,
      object,
      published: new Date().toISOString(),
      to: ["https://www.w3.org/ns/activitystreams#Public"]
    };

    // Store in local database
    await db.forumPost.create({
      data: {
        id: object.id,
        content,
        activityPubData: activity,
        authorId: actor.id,
        tags,
        ...(inReplyTo && { inReplyToId: inReplyTo })
      }
    });

    // Federate to followers
    await this.federateActivity(activity);

    return activity;
  }

  async federateActivity(activity: ActivityPubActivity): Promise<void> {
    const followers = await db.follower.findMany({
      where: { followedId: activity.actor }
    });

    // Send to each follower's inbox
    await Promise.all(
      followers.map(async (follower) => {
        const inbox = await this.discoverInbox(follower.followerId);
        if (inbox) {
          await this.deliverToInbox(inbox, activity);
        }
      })
    );
  }

  private async deliverToInbox(inbox: string, activity: ActivityPubActivity): Promise<void> {
    const date = new Date().toUTCString();
    const signature = sign({
      keyId: `${this.domain}/actor#main-key`,
      privateKey: this.privateKey,
      method: 'POST',
      url: new URL(inbox).pathname,
      headers: {
        '(request-target)': `post ${new URL(inbox).pathname}`,
        host: new URL(inbox).host,
        date,
      }
    });

    await fetch(inbox, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/activity+json',
        'Date': date,
        'Signature': signature,
      },
      body: JSON.stringify(activity)
    });
  }

  async handlePleromaPost(post: PleromaPost): Promise<void> {
    // Convert Pleroma post to local format and store
    await db.forumPost.create({
      data: {
        id: post.id,
        content: post.pleroma.content["text/markdown"] || post.pleroma.content["text/plain"],
        activityPubData: post,
        authorId: post.attributedTo,
        tags: post.tag?.filter(t => t.type === "Hashtag").map(t => t.name.slice(1)) || [],
        ...(post.inReplyTo && { inReplyToId: post.inReplyTo })
      }
    });
  }

  // ... other ActivityPub methods
}

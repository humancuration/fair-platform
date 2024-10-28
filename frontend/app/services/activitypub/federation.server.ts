import { sign, verify } from 'http-signature';
import { db } from "~/utils/db.server";
import type { ActivityPubActor, ActivityPubActivity } from "~/types/activitypub";

export class FederationService {
  constructor(
    private domain: string,
    private privateKey: string,
    private publicKey: string
  ) {}

  async federateActivity(activity: ActivityPubActivity): Promise<void> {
    // Get all known instances we federate with
    const instances = await db.federatedInstance.findMany({
      where: { status: 'active' }
    });

    // Get followers from all instances
    const followers = await db.follower.findMany({
      where: { 
        followedId: activity.actor,
        instance: { 
          in: instances.map(i => i.domain) 
        }
      }
    });

    // Federate to each instance
    await Promise.all(
      followers.map(async (follower) => {
        const inbox = await this.discoverInbox(follower.followerId);
        if (inbox) {
          await this.deliverToInbox(inbox, activity);
        }
      })
    );
  }

  async handleIncomingActivity(activity: ActivityPubActivity, signature: string): Promise<void> {
    // Verify the signature
    const isValid = await this.verifySignature(activity, signature);
    if (!isValid) {
      throw new Error('Invalid signature');
    }

    // Handle different activity types
    switch (activity.type) {
      case 'Create':
        await this.handleCreate(activity);
        break;
      case 'Like':
        await this.handleLike(activity);
        break;
      case 'Announce':
        await this.handleAnnounce(activity);
        break;
      case 'Follow':
        await this.handleFollow(activity);
        break;
      case 'Undo':
        await this.handleUndo(activity);
        break;
    }
  }

  private async handleCreate(activity: ActivityPubActivity): Promise<void> {
    const object = typeof activity.object === 'string' 
      ? await this.fetchObject(activity.object)
      : activity.object;

    // Store in local database with federation metadata
    await db.post.create({
      data: {
        id: object.id,
        content: object.content,
        authorId: activity.actor,
        federatedFrom: new URL(activity.actor).hostname,
        activityPubData: activity,
        // Add Pleroma-specific fields if present
        ...(object.pleroma && {
          pleromaContent: object.pleroma.content,
          pleromaConversationId: object.pleroma.conversation_id,
        })
      }
    });
  }

  private async handleLike(activity: ActivityPubActivity): Promise<void> {
    const objectId = typeof activity.object === 'string' 
      ? activity.object 
      : activity.object.id;

    await db.like.create({
      data: {
        actorId: activity.actor,
        objectId,
        federatedFrom: new URL(activity.actor).hostname
      }
    });
  }

  private async handleAnnounce(activity: ActivityPubActivity): Promise<void> {
    const objectId = typeof activity.object === 'string'
      ? activity.object
      : activity.object.id;

    await db.boost.create({
      data: {
        actorId: activity.actor,
        objectId,
        federatedFrom: new URL(activity.actor).hostname
      }
    });
  }

  private async handleFollow(activity: ActivityPubActivity): Promise<void> {
    const followerId = activity.actor;
    const followedId = typeof activity.object === 'string'
      ? activity.object
      : activity.object.id;

    await db.follower.create({
      data: {
        followerId,
        followedId,
        instance: new URL(followerId).hostname
      }
    });

    // Auto-accept follows (configurable)
    await this.sendAcceptFollow(activity);
  }

  private async handleUndo(activity: ActivityPubActivity): Promise<void> {
    const undoneActivity = activity.object as ActivityPubActivity;
    
    switch (undoneActivity.type) {
      case 'Like':
        await db.like.delete({
          where: {
            actorId_objectId: {
              actorId: activity.actor,
              objectId: typeof undoneActivity.object === 'string' 
                ? undoneActivity.object 
                : undoneActivity.object.id
            }
          }
        });
        break;
      case 'Announce':
        await db.boost.delete({
          where: {
            actorId_objectId: {
              actorId: activity.actor,
              objectId: typeof undoneActivity.object === 'string'
                ? undoneActivity.object
                : undoneActivity.object.id
            }
          }
        });
        break;
      case 'Follow':
        await db.follower.delete({
          where: {
            followerId_followedId: {
              followerId: activity.actor,
              followedId: typeof undoneActivity.object === 'string'
                ? undoneActivity.object
                : undoneActivity.object.id
            }
          }
        });
        break;
    }
  }

  // ... other federation methods
}

import { db } from "~/utils/db.server";
import type { ActivityPubActor } from "~/types/activitypub";

interface WebFingerLink {
  rel: string;
  type?: string;
  href?: string;
  template?: string;
}

interface WebFingerResponse {
  subject: string;
  aliases?: string[];
  links: WebFingerLink[];
  properties?: Record<string, any>;
}

interface NodeInfoLinks {
  rel: string;
  href: string;
}

interface NodeInfo {
  version: "2.1";
  software: {
    name: string;
    version: string;
  };
  protocols: string[];
  services: {
    inbound: string[];
    outbound: string[];
  };
  usage: {
    users: {
      total: number;
      activeMonth: number;
      activeHalfyear: number;
    };
    localPosts: number;
    localComments: number;
  };
  openRegistrations: boolean;
  metadata: {
    nodeName: string;
    nodeDescription: string;
    maintainer: {
      name: string;
      email: string;
    };
    features: string[];
  };
}

export class WebFingerService {
  constructor(private domain: string) {}

  async handleRequest(resource: string): Promise<WebFingerResponse | null> {
    // Handle acct: URIs
    if (resource.startsWith('acct:')) {
      const [username, domain] = resource.slice(5).split('@');
      
      // Only handle requests for our domain
      if (domain !== this.domain) {
        return null;
      }

      const user = await db.user.findFirst({
        where: { username },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          bio: true,
          activityPubId: true,
        }
      });

      if (!user) return null;

      return {
        subject: resource,
        aliases: [
          `https://${this.domain}/@${username}`,
          `https://${this.domain}/users/${username}`,
          user.activityPubId,
        ],
        links: [
          {
            rel: 'self',
            type: 'application/activity+json',
            href: `https://${this.domain}/users/${username}`,
          },
          {
            rel: 'http://webfinger.net/rel/profile-page',
            type: 'text/html',
            href: `https://${this.domain}/@${username}`,
          },
          {
            rel: 'http://schemas.google.com/g/2010#updates-from',
            type: 'application/atom+xml',
            href: `https://${this.domain}/users/${username}.atom`,
          },
          // Add Pleroma-specific links
          {
            rel: 'http://ostatus.org/schema/1.0/subscribe',
            template: `https://${this.domain}/authorize_interaction?uri={uri}`,
          },
        ],
        properties: {
          'http://schema.org/name': user.displayName,
          'http://schema.org/image': user.avatar,
          'http://schema.org/description': user.bio,
        },
      };
    }

    return null;
  }

  async discoverRemoteActor(handle: string): Promise<string | null> {
    const [username, domain] = handle.split('@');
    if (!domain) return null;

    try {
      // First try WebFinger
      const webfingerUrl = `https://${domain}/.well-known/webfinger?resource=acct:${username}@${domain}`;
      const response = await fetch(webfingerUrl, {
        headers: {
          Accept: 'application/jrd+json, application/json',
        }
      });
      
      if (response.ok) {
        const data: WebFingerResponse = await response.json();
        
        // Try to find ActivityPub actor URL
        const actorUrl = data.links.find(
          link => link.rel === 'self' && 
            (link.type === 'application/activity+json' || 
             link.type === 'application/ld+json; profile="https://www.w3.org/ns/activitystreams"')
        )?.href;

        if (actorUrl) {
          return actorUrl;
        }
      }

      // Fallback to common patterns
      const commonPatterns = [
        `https://${domain}/users/${username}`,
        `https://${domain}/@${username}`,
        `https://${domain}/accounts/${username}`,
        `https://${domain}/u/${username}`,
        `https://${domain}/actor/${username}`,
      ];

      for (const url of commonPatterns) {
        const response = await fetch(url, {
          headers: {
            Accept: 'application/activity+json, application/ld+json',
          },
        });

        if (response.ok) {
          return url;
        }
      }
    } catch (error) {
      console.error('Error discovering remote actor:', error);
    }

    return null;
  }

  async generateNodeInfo(): Promise<NodeInfo> {
    const [userCount, localPosts] = await Promise.all([
      db.user.count(),
      db.post.count({ 
        where: { 
          federatedFrom: null 
        } 
      }),
    ]);

    return {
      version: "2.1",
      software: {
        name: 'fair-platform',
        version: process.env.APP_VERSION || '0.1.0',
      },
      protocols: [
        'activitypub',
        'pleroma_chat', // Support Pleroma chat protocol
      ],
      services: {
        inbound: [],
        outbound: [
          'pleroma',
          'mastodon',
          'misskey',
        ],
      },
      usage: {
        users: {
          total: userCount,
          activeMonth: await this.getActiveUserCount(30),
          activeHalfyear: await this.getActiveUserCount(180),
        },
        localPosts,
        localComments: await db.comment.count({ 
          where: { 
            federatedFrom: null 
          } 
        }),
      },
      openRegistrations: true,
      metadata: {
        nodeName: process.env.NODE_NAME || 'Fair Platform Instance',
        nodeDescription: process.env.NODE_DESCRIPTION || 'A federated platform for fair collaboration',
        maintainer: {
          name: process.env.MAINTAINER_NAME || 'Admin',
          email: process.env.MAINTAINER_EMAIL || 'admin@example.com',
        },
        features: [
          'pleroma_api',
          'activitypub',
          'media_proxy',
          'oauth',
          'chat',
          'reactions',
          'collaborative_playlists',
          'quantum_features',
        ],
      },
    };
  }

  private async getActiveUserCount(days: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return db.user.count({
      where: {
        lastSeenAt: {
          gte: date,
        },
      },
    });
  }
}

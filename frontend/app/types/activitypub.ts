export interface ActivityPubActor {
  "@context": string[];
  id: string;
  type: "Person" | "Service" | "Application" | "Group" | "Organization";
  preferredUsername: string;
  name?: string;
  summary?: string;
  inbox: string;
  outbox: string;
  followers: string;
  following: string;
  publicKey: {
    id: string;
    owner: string;
    publicKeyPem: string;
  };
  icon?: {
    type: "Image";
    mediaType: string;
    url: string;
  };
}

export interface ActivityPubObject {
  "@context": string[];
  id: string;
  type: string;
  attributedTo: string;
  content?: string;
  published: string;
  to: string[];
  cc?: string[];
  inReplyTo?: string | null;
  tag?: Array<{
    type: "Mention" | "Hashtag";
    href: string;
    name: string;
  }>;
}

export interface ActivityPubActivity extends ActivityPubObject {
  actor: string;
  object: ActivityPubObject | string;
}

export interface PleromaPost extends ActivityPubObject {
  pleroma: {
    content: {
      "text/plain": string;
      "text/html": string;
      "text/markdown"?: string;
    };
    conversation_id?: string;
    direct_conversation_id?: string;
    emoji_reactions?: Array<{
      name: string;
      count: number;
      me: boolean;
    }>;
    thread_muted?: boolean;
    pinned?: boolean;
  };
}

import { ObjectType, Field, ID, Int, InputType, registerEnumType } from 'type-graphql';
import { MediaType, Visibility } from '@prisma/client';

registerEnumType(MediaType, {
  name: 'MediaType',
});

registerEnumType(Visibility, {
  name: 'Visibility',
});

@ObjectType()
export class MediaItem {
  @Field(() => ID)
  id: string;

  @Field(() => MediaType)
  type: MediaType;

  @Field()
  title: string;

  @Field()
  url: string;

  @Field(() => Int)
  order: number;
}

@ObjectType()
export class Playlist {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Int, { nullable: true })
  groupId?: number;

  @Field(() => [MediaItem])
  mediaItems: MediaItem[];

  @Field(() => Visibility)
  visibility: Visibility;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreatePlaylistInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  groupId?: number;

  @Field(() => Visibility)
  visibility: Visibility;
}

@InputType()
export class UpdatePlaylistInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  groupId?: number;

  @Field(() => Visibility, { nullable: true })
  visibility?: Visibility;
}

@InputType()
export class MediaItemInput {
  @Field(() => MediaType)
  type: MediaType;

  @Field()
  title: string;

  @Field()
  url: string;
}

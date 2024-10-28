import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion } from "framer-motion";
import { FaReply, FaRetweet, FaHeart } from "react-icons/fa";
import { ActivityPubService } from "~/services/activitypub.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const post = await db.forumPost.findUnique({
    where: { id: params.postId },
    include: {
      author: true,
      replies: true,
      reactions: true,
    }
  });

  return json({ post });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { action, postId, content } = Object.fromEntries(formData);

  const activityPub = new ActivityPubService(
    process.env.DOMAIN!,
    process.env.ACTIVITYPUB_PRIVATE_KEY!
  );

  switch (action) {
    case "reply":
      await activityPub.createForumPost(content as string, [], postId as string);
      break;
    case "boost":
      await activityPub.announcePost(postId as string);
      break;
    case "like":
      await activityPub.likePost(postId as string);
      break;
  }

  return json({ success: true });
};

// Component implementation...

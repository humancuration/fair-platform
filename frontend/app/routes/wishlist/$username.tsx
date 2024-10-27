import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/db.server';
import { WishlistGrid } from '~/components/wishlist/WishlistGrid';

export const loader: LoaderFunction = async ({ params }) => {
  const wishlist = await prisma.wishlist.findFirst({
    where: { 
      user: { username: params.username },
      isPublic: true 
    },
    include: { items: true }
  });

  if (!wishlist) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ items: wishlist.items, username: params.username });
};

export default function PublicWishlistRoute() {
  const { items, username } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{username}'s Wishlist</h1>
      <WishlistGrid items={items} isPublic />
    </>
  );
}

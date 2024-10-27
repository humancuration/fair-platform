import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/utils/auth.server";
import { formatCurrency } from "~/utils/formatters";

export async function loader({ params }: LoaderFunctionArgs) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: {
      vendor: {
        select: {
          name: true,
          sustainabilityRating: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  return json({ product });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "addToCart": {
      const quantity = Number(formData.get("quantity")) || 1;
      
      const cart = await prisma.cart.upsert({
        where: { userId },
        create: { userId },
        update: {},
      });

      await prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: params.productId!,
          },
        },
        create: {
          cartId: cart.id,
          productId: params.productId!,
          quantity,
        },
        update: {
          quantity: { increment: quantity },
        },
      });

      return redirect("/marketplace/cart");
    }

    case "addReview": {
      const rating = Number(formData.get("rating"));
      const content = formData.get("content") as string;

      await prisma.review.create({
        data: {
          rating,
          content,
          userId,
          productId: params.productId!,
        },
      });

      return json({ success: true });
    }

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function ProductDetailPage() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-blue-600 mb-4">
            {formatCurrency(product.price)}
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.vendor && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Vendor</h2>
              <p className="text-gray-600">{product.vendor.name}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">Sustainability Rating:</span>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {product.vendor.sustainabilityRating}/10
                </span>
              </div>
            </div>
          )}

          <Form method="post" className="mb-8">
            <input type="hidden" name="intent" value="addToCart" />
            <div className="flex gap-4 mb-4">
              <input
                type="number"
                name="quantity"
                defaultValue="1"
                min="1"
                className="w-20 p-2 border rounded"
              />
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          </Form>

          {product.reviews.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {review.user.avatar && (
                        <img
                          src={review.user.avatar}
                          alt={review.user.username}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="font-medium">{review.user.username}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-${
                            i < review.rating ? 'yellow' : 'gray'
                          }-400`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Unable to load product details. Please try again later.</p>
    </div>
  );
}

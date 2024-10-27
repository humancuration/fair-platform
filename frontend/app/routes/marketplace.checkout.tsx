import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/utils/auth.server";
import { formatCurrency } from "~/utils/formatters";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart?.items.length) {
    return redirect("/marketplace/cart");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      shippingAddress: true,
    },
  });

  return json({ cart, user });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        status: 'pending',
        shippingAddress: formData.get("shippingAddress") as string,
        email: formData.get("email") as string,
      },
    });

    // Get cart items
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart?.items.length) {
      throw new Error("Cart is empty");
    }

    // Create order items
    await tx.orderItem.createMany({
      data: cart.items.map(item => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
    });

    // Clear cart
    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });

  return redirect(`/marketplace/orders/${order.id}`);
}

export default function CheckoutPage() {
  const { cart, user } = useLoaderData<typeof loader>();
  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p>{formatCurrency(item.quantity * item.product.price)}</p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Shipping Address</label>
            <textarea
              name="shippingAddress"
              defaultValue={user.shippingAddress || ''}
              required
              rows={4}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Place Order
          </button>
        </Form>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="p-4 bg-red-50 text-red-900 rounded-lg">
      <h1 className="text-lg font-bold">Error</h1>
      <p>Something went wrong during checkout. Please try again later.</p>
    </div>
  );
}

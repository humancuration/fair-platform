import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/db.server";
import { formatCurrency } from "~/utils/formatters";
import { Button } from "~/components/shared/Button";

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

  return json({ cart });
}

export default function ShoppingCartPage() {
  const { cart } = useLoaderData<typeof loader>();

  if (!cart?.items.length) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/marketplace">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <div 
              key={item.id} 
              className="flex gap-4 p-4 mb-4 bg-white rounded-lg shadow"
            >
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">{formatCurrency(item.product.price)}</p>
                <div className="flex items-center gap-4 mt-2">
                  <Form method="post">
                    <input type="hidden" name="intent" value="updateQuantity" />
                    <input type="hidden" name="itemId" value={item.id} />
                    <select
                      name="quantity"
                      defaultValue={item.quantity}
                      onChange={(e) => e.target.form?.submit()}
                      className="border rounded p-1"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </Form>
                  <Form method="post" className="inline">
                    <input type="hidden" name="intent" value="removeItem" />
                    <input type="hidden" name="itemId" value={item.id} />
                    <button 
                      type="submit"
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Link 
            to="/marketplace/checkout"
            className="block w-full bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center text-red-600">
      <h1 className="text-2xl font-bold mb-4">Error</h1>
      <p>Something went wrong loading your cart. Please try again later.</p>
    </div>
  );
}

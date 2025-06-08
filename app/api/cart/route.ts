import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

type CartItem = {
  slug: string;
  quantity: number;
  name: string;
  price: number;
  mainImage: string;
};

type Cart = {
  guestId: string;
  items: CartItem[];
};

// POST: Add or update cart items
export async function POST(req: Request) {
  const { slug, quantity, price } = await req.json();  // Receive price (can be dynamic based on weight/seed)
  console.log(`Received data: slug=${slug}, quantity=${quantity}, price=${price}`);

  // Extract or generate guestId
  const cookies = req.headers.get('cookie') || '';
  const newGuestId = 'guest-' + Date.now();
  const guestId =
    cookies.split('; ').find((c) => c.startsWith('guestId='))?.split('=')[1] || newGuestId;

  console.log(`[POST] Updating cart. GuestID: ${guestId}, Slug: ${slug}, Quantity: ${quantity}, Price: ${price}`);

  if (!slug || price === undefined) {
    return NextResponse.json({ error: 'Product slug and price are required' }, { status: 400 });
  }
  if (!Number.isInteger(quantity)) {
    return NextResponse.json({ error: 'Quantity must be an integer' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const cartCollection = db.collection('cart');
    const productsCollection = db.collection("products");

    // Fetch product using slug
    const product = await productsCollection.findOne({ slug });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Use the selected price or fallback to the product's default price
    const finalPrice = price || product.price;

    // Fetch or create the cart
    let cart = (await cartCollection.findOne({ guestId })) as Cart | null;

    if (!cart) {
      if (quantity > 0) {
        cart = {
          guestId,
          items: [
            {
              slug,
              quantity,
              name: product.name,
              price: finalPrice,  // Store the correct price in the cart
              mainImage: product.mainImage,
            },
          ],
        };
        await cartCollection.insertOne(cart);
      }
    } else {
      const itemIndex = cart.items.findIndex((item) => item.slug === slug);
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = finalPrice;  // Update price if necessary
        if (cart.items[itemIndex].quantity <= 0) {
          cart.items.splice(itemIndex, 1); // Remove item if quantity reaches zero
        }
      } else if (quantity > 0) {
        cart.items.push({
          slug,
          quantity,
          name: product.name,
          price: finalPrice,  // Store the correct price in the cart
          mainImage: product.mainImage,
        });
      }

      if (cart.items.length > 0) {
        await cartCollection.updateOne({ guestId }, { $set: { items: cart.items } });
      } else {
        await cartCollection.deleteOne({ guestId }); // Delete cart if empty
      }
    }

    const headers = new Headers();
    if (newGuestId === guestId) {
      headers.append('Set-Cookie', `guestId=${guestId}; Path=/; HttpOnly; SameSite=Strict`);
    }

    const updatedCart = await cartCollection.findOne({ guestId });
    return NextResponse.json(
      { message: 'Cart updated', cart: updatedCart },
      { headers }
    );
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// GET: Retrieve cart data
export async function GET(req: Request) {
  const cookies = req.headers.get('cookie') || '';
  const newGuestId = 'guest-' + Date.now();
  const guestId =
    cookies.split('; ').find((c) => c.startsWith('guestId='))?.split('=')[1] || newGuestId;

  console.log(`[GET] Fetching cart. GuestID: ${guestId}`);

  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const cartCollection = db.collection('cart');
    const cart = (await cartCollection.findOne({ guestId })) as Cart | null;

    const headers = new Headers();
    if (newGuestId === guestId) {
      headers.append('Set-Cookie', `guestId=${guestId}; Path=/; HttpOnly; SameSite=Strict`);
    }

    if (!cart) {
      return NextResponse.json(
        { message: 'Cart is empty', cart: null },
        { headers }
      );
    }

    return NextResponse.json({ cart }, { headers });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// DELETE: Remove an item or clear the cart
export async function DELETE(req: Request) {
  const { slug } = await req.json();

  // Extract guestId
  const cookies = req.headers.get('cookie') || '';
  const guestId =
    cookies.split('; ').find((c) => c.startsWith('guestId='))?.split('=')[1];

  if (!guestId) {
    return NextResponse.json({ error: 'No cart found' }, { status: 400 });
  }

  console.log(`[DELETE] Removing item from cart. GuestID: ${guestId}, Slug: ${slug}`);

  try {
    const client = await clientPromise;
    const db = client.db("school-project");
    const cartCollection = db.collection('cart');

    // Fetch the cart
    let cart = (await cartCollection.findOne({ guestId })) as Cart | null;
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    if (slug) {
      // Remove specific item
      cart.items = cart.items.filter((item) => item.slug !== slug);
      if (cart.items.length > 0) {
        await cartCollection.updateOne({ guestId }, { $set: { items: cart.items } });
      } else {
        await cartCollection.deleteOne({ guestId }); // Delete cart if empty
      }
    } else {
      // Delete entire cart
      await cartCollection.deleteOne({ guestId });
    }

    return NextResponse.json({ message: 'Cart updated', cart });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}
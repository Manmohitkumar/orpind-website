import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ items: [], subtotal: 0, itemCount: 0 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            originalPrice: true,
            images: true,
            weight: true,
            category: true,
            stockCount: true,
            isActive: true,
          },
        },
      },
    });

    const items = cartItems
      .filter(item => item.product.isActive)
      .map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        selectedWeight: item.selectedWeight,
        product: item.product,
        itemTotal: item.product.price * item.quantity,
      }));

    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ items, subtotal, itemCount });
  } catch (error) {
    return apiError(error, 'GET /api/cart');
  }
}

async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Please login to add items to cart' }, { status: 401 });
    }

    const { productId, selectedWeight, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (product.stockCount < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { userId: user.id, productId, selectedWeight: selectedWeight || null },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stockCount) {
        return NextResponse.json({ error: 'Cannot add more than available stock' }, { status: 400 });
      }
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId: user.id,
          productId,
          selectedWeight: selectedWeight || product.weight?.[0] || '',
          quantity,
        },
      });
    }

    return NextResponse.json({ message: 'Item added to cart' }, { status: 201 });
  } catch (error) {
    return apiError(error, 'POST /api/cart');
  }
}

async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, quantity } = await request.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ error: 'Item ID and quantity are required' }, { status: 400 });
    }

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { id: itemId, userId: user.id } });
      return NextResponse.json({ message: 'Item removed from cart' });
    }

    await prisma.cartItem.updateMany({
      where: { id: itemId, userId: user.id },
      data: { quantity },
    });

    return NextResponse.json({ message: 'Cart updated' });
  } catch (error) {
    return apiError(error, 'PUT /api/cart');
  }
}

async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (itemId) {
      await prisma.cartItem.deleteMany({ where: { id: itemId, userId: user.id } });
      return NextResponse.json({ message: 'Item removed from cart' });
    }

    await prisma.cartItem.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    return apiError(error, 'DELETE /api/cart');
  }
}

export { GET, POST, PUT, DELETE };

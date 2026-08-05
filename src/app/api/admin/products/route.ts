import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/db';
import { apiError } from '@/lib/api-utils';

function isAdmin(role: string) {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return apiError(error, 'Admin GET /api/admin/products');
  }
}

async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        shortDescription: body.shortDescription,
        price: parseInt(body.price),
        originalPrice: body.originalPrice ? parseInt(body.originalPrice) : null,
        category: body.category,
        subcategory: body.subcategory || null,
        sku: body.sku || null,
        images: body.images || [],
        weight: body.weight || [],
        stockCount: parseInt(body.stockCount || '0'),
        lowStockThreshold: parseInt(body.lowStockThreshold || '10'),
        isNew: body.isNew || false,
        isBestseller: body.isBestseller || false,
        isOrganic: body.isOrganic !== false,
        origin: body.origin || 'Punjab, India',
        fssaiNumber: body.fssaiNumber || null,
        ingredients: body.ingredients || [],
        tags: body.tags || [],
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return apiError(error, 'Admin POST /api/admin/products');
  }
}

async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updateData: any = { ...data };
    if (data.price) updateData.price = parseInt(data.price);
    if (data.originalPrice) updateData.originalPrice = parseInt(data.originalPrice);
    if (data.stockCount) updateData.stockCount = parseInt(data.stockCount);

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ product });
  } catch (error) {
    return apiError(error, 'Admin PUT /api/admin/products');
  }
}

async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || !isAdmin(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: 'Product deactivated' });
  } catch (error) {
    return apiError(error, 'Admin DELETE /api/admin/products');
  }
}

export { GET, POST, PUT, DELETE };

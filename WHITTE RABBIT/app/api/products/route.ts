import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
  });
  return Response.json(products);
}

export async function POST(req: Request) {
  // Admin only
  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      description: body.description,
      categoryId: body.categoryId,
      image: body.image,
    },
    include: { category: true },
  });
  return Response.json(product, { status: 201 });
}

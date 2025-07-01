import { NextResponse } from 'next/server';
import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

export async function POST(req: Request) {
  await sequelize.sync();
  const { short } = await req.json();

  if (!short) {
    return NextResponse.json({ error: 'Short is required.' }, { status: 400 });
  }

  await linkModel.update(
    { isDeleted: true },
    { where: { short, isDeleted: false } }
  );

  return NextResponse.json({ deleted: true });
}
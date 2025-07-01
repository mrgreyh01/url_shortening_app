import { NextResponse } from 'next/server';
import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

export async function POST(req: Request) {
  await sequelize.sync();
  const { userId } = await req.json();
  await linkModel.update(
  { isDeleted: true },
  { where: { userId, isDeleted: false } }
  );
  return NextResponse.json({ deleted: true });
}
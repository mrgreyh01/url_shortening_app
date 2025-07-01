import { NextResponse } from 'next/server';
import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

export async function GET(req: Request) {
  await sequelize.sync();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

  const links = await linkModel.findAll({ where: { userId, isDeleted: false } });  
  return NextResponse.json({ links });
}
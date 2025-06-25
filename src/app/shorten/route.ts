'use server';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

export async function POST(req: Request) {
  await sequelize.sync();

  const { originalUrl } = await req.json();
  const short = nanoid(6);

  try {
    const existing = await linkModel.findOne({ where: { original: originalUrl } });
    if (existing) return NextResponse.json({ short: existing.getDataValue('short') });

    const newLink = await linkModel.create({ short, original: originalUrl });
    return NextResponse.json({ short: newLink.getDataValue('short') });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

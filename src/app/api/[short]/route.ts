import { NextResponse } from 'next/server';
import Link from '@/models/link';
import sequelize from '@/lib/sequelize';

export async function GET(
  _req: Request,
  { params }: { params: { short: string } }
) {
  await sequelize.sync(); // dev only

  const link = await Link.findOne({ where: { short: params.short } });
  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.redirect(link.getDataValue('original'));
}

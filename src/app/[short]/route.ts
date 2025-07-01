import { NextResponse } from 'next/server';
import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

export async function GET(
  request: Request,
  context: { params: Promise<{ short: string }> }
) {
  const { short } = await context.params
  await sequelize.sync(); // dev only

  const link = await linkModel.findOne({ where: { short: short, isDeleted: false } });
  if (!link) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  await link.increment('traffic');
  // Redirect to the original URL
  return NextResponse.redirect(link.getDataValue('original'));
}

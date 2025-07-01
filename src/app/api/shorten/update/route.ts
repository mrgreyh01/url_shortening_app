import { NextResponse } from 'next/server';
import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

export async function POST(req: Request) {
  await sequelize.sync();
  const body = await req.json();

  const { id, originalUrl, short } = body;

  if (!id) {
    return NextResponse.json({ error: 'Link id is required.' }, { status: 400 });
  }

  // Find the link by id and ensure it's not deleted
  const link = await linkModel.findOne({ where: { id, isDeleted: false } });
  if (!link) {
    return NextResponse.json({ error: 'Link not found or already deleted.' }, { status: 404 });
  }

  // Prepare update data
  const updateData: Record<string, any> = {};

  // Always allow updating 'original'
  if (originalUrl !== undefined) {
    updateData.original = originalUrl;
  }

  // If 'short' is requested to be updated
  if (short !== undefined) {
    // Check if the new short already exists (and is not deleted), excluding this record
    const exists = await linkModel.findOne({
      where: {
        short,
        isDeleted: false,
      },
    });

    if (exists) {
      return NextResponse.json(
        { error: 'Short link already exists.' },
        { status: 409 }
      );
    }

    updateData.short = short;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update.' },
      { status: 400 }
    );
  }

  await link.update(updateData);

  return NextResponse.json({ updated: true });
}
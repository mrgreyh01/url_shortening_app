'use server';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import linkModel from '@/models/link';
import sequelize from '@/lib/sequelize';

// Simple URL validation function
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Accept only http or https protocols
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  await sequelize.sync();

  const { originalUrl, userId, customLink } = await req.json();

  // Validate the input URL
  if (!originalUrl || !isValidUrl(originalUrl)) {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 });
  }

  if (customLink && customLink.length > 0) {
    // Check if the custom link is already taken
    const existingCustomLink = await linkModel.findOne({ where: { short: customLink, userId } });
    if (existingCustomLink) {
      return NextResponse.json({ error: 'Custom link already exists.' }, { status: 400 });
    }

    // Validate custom link format
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(customLink)) {
      return NextResponse.json({ error: 'Invalid custom link format.' }, { status: 400 });
    }

    // Create the new link with the custom short link
    try {
      const newLink = await linkModel.create({ userId, short: customLink, original: originalUrl });
      return NextResponse.json({ short: newLink.getDataValue('short') });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
  }

  const short = nanoid(6);

  try {
    const existing = await linkModel.findOne({ where: { original: originalUrl, userId: userId } });
    if (existing) return NextResponse.json({ short: existing.getDataValue('short') });

    const newLink = await linkModel.create({ userId, short, original: originalUrl });
    return NextResponse.json({ short: newLink.getDataValue('short') });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

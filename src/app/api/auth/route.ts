import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import userModel from '@/models/user';
import sessionModel from '@/models/session';
import sequelize from '@/lib/sequelize';

export async function POST(req: Request) {
  await sequelize.sync();
  const { email, password } = await req.json();

  const user = await userModel.findOne({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.getDataValue('password'));
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  // Generate sessionId and expiration
  const sessionId = nanoid(32);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90); // 90 days

  // Store session in DB
  await sessionModel.create({
    sessionId,
    userId: user.getDataValue('userId'),
    expiresAt,
  });

  const res = NextResponse.json({
    userId: user.getDataValue('userId'),
    name: user.getDataValue('name'),
    sessionId,
  });

  res.cookies.set('sessionId', sessionId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: '/',
    sameSite: 'lax',
    secure: true,
  });

  return res;
}
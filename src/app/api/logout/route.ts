import { NextResponse } from 'next/server';
import sessionModel from '@/models/session';
import sequelize from '@/lib/sequelize';

export async function POST(req: Request) {
  await sequelize.sync();

  // Get sessionId from cookies
  const cookie = req.headers.get('cookie');
  const sessionId = cookie
    ?.split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('sessionId='))
    ?.split('=')[1];

  if (!sessionId) {
    return NextResponse.json({ error: 'No session found.' }, { status: 400 });
  }

  // Remove session from DB
  await sessionModel.destroy({ where: { sessionId } });
  const res = NextResponse.json(
    { message: 'Logged out successfully.' },
    { status: 200 }
  );
  
  return res;
}
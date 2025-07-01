import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import userModel from '@/models/user';
import sequelize from '@/lib/sequelize';

function validateName(name: string) {
  return /^[A-Za-z\s]+$/.test(name);
}
function validatePassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[@#$&*_\-\s]/.test(password)
  );
}

export async function POST(req: Request) {
  await sequelize.sync();
  const { name, email, password } = await req.json();

  if (!validateName(name)) {
    return NextResponse.json({ error: 'Name must contain only alphabets and spaces.' }, { status: 400 });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
  }
  if (!validatePassword(password)) {
    return NextResponse.json({ error: 'Password must be at least 8 characters, have one uppercase and one special character.' }, { status: 400 });
  }
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const existing = await userModel.findOne({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });
  }

  if (password.includes(' ')) {
    return NextResponse.json({ error: 'Password cannot contain spaces.' }, { status: 400 });
  }
  
  const hashed = await bcrypt.hash(password, 10);
  const user = await userModel.create({ name, email, password: hashed });
  return NextResponse.json({ userId: user.getDataValue('userId'), name, email });
}
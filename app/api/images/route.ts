import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const folder = searchParams.get('folder');

  if (!folder) {
    return NextResponse.json({ error: 'Folder parameter is required' }, { status: 400 });
  }

  const publicDir = path.join(process.cwd(), 'public', folder);

  try {
    // Check if directory exists
    if (!fs.existsSync(publicDir)) {
      return NextResponse.json([]);
    }

    // Read directory contents
    const files = fs.readdirSync(publicDir);

    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext) && !file.startsWith('.');
    });

    return NextResponse.json(imageFiles);
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json([]);
  }
}

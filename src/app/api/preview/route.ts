import { NextResponse } from 'next/server';
import { createMockPreview, isValidUrl } from '@/lib/platform';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: unknown };
    const url = typeof body.url === 'string' ? body.url.trim() : '';

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'URL http/https yang valid diperlukan.' }, { status: 400 });
    }

    const preview = await createMockPreview(url);

    return NextResponse.json({ preview });
  } catch {
    return NextResponse.json({ error: 'Tidak dapat memproses request mock preview.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: 'GitHub Client ID is missing' },
      { status: 500 }
    );
  }

  const baseUrl =
    process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const redirectUri = `${baseUrl}/api/auth/callback`;

  const requestedReturnTo =
    request.nextUrl.searchParams.get('returnTo') || '/blog';

  const returnTo =
    requestedReturnTo.startsWith('/') &&
      !requestedReturnTo.startsWith('//')
      ? requestedReturnTo
      : '/blog';

  const githubAuthUrl = new URL(
    'https://github.com/login/oauth/authorize'
  );

  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', 'read:user user:email');

  const response = NextResponse.redirect(githubAuthUrl);

  response.cookies.set('auth_return_to', returnTo, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 10 * 60,
    path: '/',
  });

  return response;
}

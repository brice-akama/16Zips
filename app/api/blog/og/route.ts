// app/api/blog/og/route.ts
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React from 'react';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Blog Post';

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          fontSize: 60,
          background: 'white',
          width: '100%',
          height: '100%',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: '8px solid black',
        }
      },
      React.createElement(
        "div",
        { style: { color: 'black' } },
        title
      )
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

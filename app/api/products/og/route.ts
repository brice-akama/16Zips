// app/api/products/og/route.ts
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import React from 'react';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Product';

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          fontSize: 60,
          background: '#f4f4f4',
          width: '100%',
          height: '100%',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '8px solid #333',
        }
      },
      React.createElement(
        "div",
        { style: { color: '#111', fontWeight: 'bold', textAlign: 'center' } },
        title
      )
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

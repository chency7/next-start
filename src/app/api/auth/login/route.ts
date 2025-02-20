import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/api/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 实现登录逻辑
    const response: ApiResponse = {
      code: 200,
      data: { token: 'example-token' },
      message: '登录成功',
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        message: '服务器错误',
      },
      { status: 500 }
    );
  }
}

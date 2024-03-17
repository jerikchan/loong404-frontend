import pool from '../db';
import { type NextRequest } from 'next/server';
import { type IUsage } from '@/types';
import { RowDataPacket } from 'mysql2/promise';

interface IUsageRow extends IUsage, RowDataPacket {}

async function getUsage(address: string, month: string) {
  const connection = await pool.getConnection();
  const [rows] = await connection.query<IUsageRow[]>(
    'SELECT * FROM `usages` WHERE `address` = ? AND `month` = ?',
    [address, month]
  );
  return rows?.[0] || null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const month = searchParams.get('month');
  const address = searchParams.get('address');

  if (!address || !month) {
    return new Response(
      JSON.stringify({
        msg: 'address and month are required',
        code: 1,
        data: null,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  try {
    const usage = await getUsage(address, month);
    return new Response(
      JSON.stringify({
        msg: 'success',
        code: 0,
        data: usage,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        msg: (error as Error).message,
        code: 1,
        data: {
          error: (error as Error).stack,
        },
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const res = await request.json();
  const address = res.address;
  const month = res.month;

  if (!address || !month) {
    return new Response(
      JSON.stringify({
        msg: 'address and month are required',
        code: 1,
        data: null,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO usages (address, month, count) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE count = count + 1',
      [address, month]
    );

    const usage = await getUsage(address, month);
    return new Response(
      JSON.stringify({
        msg: 'success',
        code: 0,
        data: usage,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        msg: (error as Error).message,
        code: 1,
        data: {
          error: (error as Error).toString(),
        },
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
}

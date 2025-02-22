import { promises as fs } from 'fs';
import path from 'path';
import type { MusicInfo } from '@/types/music';

export async function GET() {
    try {
        // 获取 public/music 目录的绝对路径
        const musicDir = path.join(process.cwd(), 'public', 'music');

        // 读取目录中的所有文件
        const files = await fs.readdir(musicDir);

        // 过滤出音频文件并生成音乐信息列表
        const musicList: MusicInfo[] = files
            .filter(file => /\.(mp3|wav|ogg)$/i.test(file))
            .map(file => ({
                id: file,
                name: path.parse(file).name, // 去除文件扩展名
                path: `/music/${file}`, // 相对于 public 目录的路径
            }));

        // 返回音乐列表
        return Response.json(musicList);

    } catch (error) {
        console.error('Error reading music directory:', error);
        return Response.json(
            { error: '无法读取音乐文件' },
            { status: 500 }
        );
    }
} 
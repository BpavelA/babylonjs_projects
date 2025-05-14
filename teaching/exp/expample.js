import hlsdl from 'hls-dl';
import { createWriteStream } from 'fs';

const httpstream = hlsdl('https://kinescope.io/be537cc2-de76-4fc7-8053-7cd55657a328/media.m3u8');
httpstream.pipe(createWriteStream('save_file_https.mp4'));

// additionally, a playlist file in the file system can be loaded as well
// const filestream = hlsdl('file:///Users/Pavel/Documents/file.m3u8');
// filestream.pipe(fs.createWriteStream('save_file_local.mp4'));
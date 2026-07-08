import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Tidak ada berkas yang diunggah' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to Base64 string for Cloudinary upload
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Upload to Cloudinary under the 'pelayanan-desa' folder
    const response = await cloudinary.uploader.upload(base64Image, {
      folder: 'pelayanan-desa',
    });

    return NextResponse.json({ url: response.secure_url });
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json({ error: error.message || 'Gagal mengunggah berkas ke Cloudinary' }, { status: 500 });
  }
}

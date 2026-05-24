import {v2 as cloudinary} from 'cloudinary';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    console.log("Received request to delete image from Cloudinary");
    const { url } = await request.json();

    // Extract the public_id from the full Cloudinary URL
    const segments = url.split('/');
    const uploadIndex = segments.indexOf('upload');
    // Grabs everything after '/upload/' and removes the file extension
    const publicIdWithExtension = segments.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

    // Delete the asset
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to delete from Cloudinary' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
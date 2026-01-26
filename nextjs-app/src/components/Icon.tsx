'use client';

import Image from 'next/image';

interface IconProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function Icon({ 
  src, 
  alt = '', 
  width = 24, 
  height = 24, 
  className = '' 
}: IconProps) {
  // For SVG files, use img tag for better compatibility with inline styles
  if (src.endsWith('.svg')) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ display: 'block' }}
      />
    );
  }

  // For other images, use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

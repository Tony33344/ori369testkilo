'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

interface VideoEmbedProps {
  videoUrl: string;
  autoplay?: boolean;
}

export default function VideoEmbed({ videoUrl, autoplay = false }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);

  return (
    <div className="relative w-full max-w-5xl mx-auto my-12 rounded-2xl overflow-hidden shadow-2xl">
      {isPlaying ? (
        <div className="relative aspect-video bg-black">
          <video
            src={videoUrl}
            autoPlay
            controls
            className="w-full h-full object-contain"
            playsInline
          />
          <button
            onClick={() => setIsPlaying(false)}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <div className="absolute inset-0 bg-[#00B5AD]/10 group-hover:bg-[#00B5AD]/20 transition-colors duration-300"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#00B5AD] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Play size={32} className="text-white ml-1" />
            </div>
            <p className="mt-4 text-white font-medium text-lg">Predvajaj video</p>
          </div>
        </div>
      )}
    </div>
  );
}

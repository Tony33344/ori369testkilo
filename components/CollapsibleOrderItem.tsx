'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface CollapsibleOrderItemProps {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  totalPrice: number;
  image?: string;
  bookingDate?: string | null;
  bookingTime?: string | null;
  type: 'service' | 'product' | 'education';
}

export default function CollapsibleOrderItem({
  id,
  name,
  description,
  quantity,
  totalPrice,
  image,
  bookingDate,
  bookingTime,
  type,
}: CollapsibleOrderItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
      {/* Summary Row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
      >
        {image && (
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={image}
              alt={name}
              fill
              sizes="48px"
              className="object-cover rounded-md"
            />
          </div>
        )}
        
        <div className="flex-1 text-left min-w-0">
          <p className="font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-sm text-gray-500">
            {quantity > 1 ? `Količina: ${quantity}` : ''}
            {quantity > 1 && bookingDate ? ' • ' : ''}
            {bookingDate ? `${bookingDate}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="font-bold text-gray-900">€{totalPrice.toFixed(2)}</p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
          {description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Opis
              </p>
              <p className="text-sm text-gray-700">{description}</p>
            </div>
          )}

          {quantity > 1 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Količina
              </p>
              <p className="text-sm text-gray-700">{quantity}x</p>
            </div>
          )}

          {bookingDate && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Termin
              </p>
              <p className="text-sm text-gray-700">
                {bookingDate}
                {bookingTime && ` ob ${bookingTime}`}
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-700">Skupaj:</p>
              <p className="text-lg font-bold text-[#00B5AD]">€{totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

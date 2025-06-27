"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart-context"; // Import useCart hook
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { ShoppingCart } from "lucide-react";

interface FloatingScrollButtonProps {
  targetId: string; // The ID of the section to scroll to (should be "checkout")
}

export function FloatingScrollButton({ targetId }: FloatingScrollButtonProps) {
  // Get the cart state to check item count
  const { state } = useCart();

  // State to control the visibility of the "Cart is empty" message
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  // Effect to automatically hide the "Cart is empty" message after a few seconds
  useEffect(() => {
    if (showEmptyMessage) {
      const timer = setTimeout(() => {
        setShowEmptyMessage(false);
      }, 3000); // Hide message after 3 seconds (adjust time as needed)
      return () => clearTimeout(timer); // Clean up the timer if the component unmounts or showEmptyMessage changes
    }
  }, [showEmptyMessage]); // This effect runs whenever showEmptyMessage changes

  const handleAction = () => {
    if (state.itemCount > 0) {
      // If cart has items, scroll to the target section
      try {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else {
          console.warn(`Element with id "${targetId}" not found for scrolling.`);
        }
      } catch (error) {
        console.error("Scroll error:", error);
      }
    } else {
      // If cart is empty, show the "Cart is empty" message
      setShowEmptyMessage(true);
    }
  };

  return (
    // Use a wrapper div to position the button and the message together
    // This div is also fixed
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-end">
        {/* Optional: Display the message above the button */}
        {showEmptyMessage && (
            <div className="mb-2 px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-md shadow-md animate-slide-in-up"> {/* Add 'animate-slide-in-up' for basic animation */}
                Your cart is empty!
            </div>
        )}

      <Button
        variant="default" // Or your preferred variant (like 'outline', 'secondary')
        size="icon" // Makes the button round and adds default padding for icon
        className="relative rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        onClick={handleAction} // Call the new conditional handler
        aria-label={state.itemCount > 0 ? `Scroll to ${targetId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}` : "Your cart is empty"} // Make aria-label descriptive
      >
        {/* ShoppingCart icon - Size is handled by the icon itself */}
        <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />

        {/* Badge for item count - Only show if itemCount > 0 */}
        {state.itemCount > 0 && (
          <Badge
            variant="destructive" // Uses the red background from Shadcn's destructive variant
            className="absolute -top-1 -right-1 text-[10px] sm:text-xs w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full p-0 bg-red-600 text-white font-bold border-2 border-white" // Custom styling for size, position, look
          >
            {state.itemCount > 9 ? "9+" : state.itemCount} {/* Display count, cap at 9+ */}
          </Badge>
        )}
      </Button>
    </div>
  );
}

// You might still need the simple animation CSS for the message bubble in your global stylesheet (e.g., app/globals.css)
/*
@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slide-in-up 0.3s ease-out forwards;
}
*/
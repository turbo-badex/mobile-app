
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, ThumbsUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "Smooth Talk", "Funny", "Nigerian", "Romantic"];

const PickupLinesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Pickup Lines</h1>
          <p className="text-gray-600 mt-2">Browse and copy the best Nigerian pickup lines</p>
        </div>

        <div className="flex overflow-x-auto pb-2 gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant="outline"
              className={cn(
                "whitespace-nowrap",
                activeCategory === category && "bg-[#3155F6] text-white hover:bg-[#2845d9]"
              )}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {pickupLines
            .filter(line => activeCategory === "All" || line.category === activeCategory)
            .map((line, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-lg mb-4">"{line.text}"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{line.category}</span>
                    <div className="flex gap-3">
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {line.likes}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="text-center mt-8">
          <Button className="bg-[#3155F6]">
            Generate New Pickup Line
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

const pickupLines = [
  {
    text: "Are you a bank? Because I'm interested in your figures.",
    category: "Smooth Talk",
    likes: 245
  },
  {
    text: "My love for you is like MTN network - it never drops.",
    category: "Funny",
    likes: 189
  },
  {
    text: "If you were garri, you'd be the one that doesn't need sugar.",
    category: "Nigerian",
    likes: 321
  },
  {
    text: "You must be jollof rice, because I can't resist you at any owambe.",
    category: "Nigerian",
    likes: 156
  },
  {
    text: "Is your dad a boxer? Because you're a knockout!",
    category: "Funny",
    likes: 142
  },
  {
    text: "You must be causing global warming because you're melting my heart.",
    category: "Romantic",
    likes: 211
  }
];

export default PickupLinesPage;

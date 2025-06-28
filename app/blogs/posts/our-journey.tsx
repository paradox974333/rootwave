import NextImage from "next/image"; // Only if you use NextImage in your content

// Metadata for this specific post
export const meta = {
  title: "Our Journey Towards Sustainable Innovation",
  date: "2024-02-10", // YYYY-MM-DD for sorting
  author: "The Rootwave Team",
  readTimeMinutes: 6,
  image: "/blog-images/Leonardo_Phoenix_10_In_a_visually_striking_commercial_ad_shoot_0.jpg", // Path from /public directory
  tags: ["Sustainability", "Innovation", "Rootwave", "Eco-Friendly"],
  description: "Discover Rootwave's mission to drive sustainable innovation, starting with edible rice straws and expanding to broader eco-friendly solutions.",
  keywords: "sustainable innovation, Rootwave, eco-friendly packaging, rice straws, green tech",
};

// The actual blog post content as a Server Component
export default function OurJourneyPostContent() {
  return (
    <>
      <p className="mb-6 text-lg leading-relaxed">
        Welcome to the Rootwave blog! We're excited to share our journey and insights into the world of sustainable innovation. Our mission has always been to find creative and impactful solutions to environmental challenges, starting with the humble drinking straw and expanding our vision to broader packaging and material science.
      </p>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 mt-8">
        The Genesis of an Idea
      </h2>
      <p className="mb-6 text-lg leading-relaxed">
        It all began with a simple question: how can we reduce plastic waste in a way that is not just eco-friendly but also enhances the user experience? This led us to explore agricultural byproducts, specifically rice, as a viable alternative. The development of our edible rice straws was a breakthrough, offering a product that is sturdy, pleasant to use, and leaves zero waste if consumed or composted.
      </p>
      <p className="mb-6 text-lg leading-relaxed">
        Our commitment doesn't stop at straws. We are continuously researching and developing new materials derived from natural, renewable resources. The goal is to create a circular economy where products return to the earth beneficially or are repurposed effectively.
      </p>
      <blockquote className="my-8 p-6 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 italic rounded-r-lg">
        "Sustainability is not a trend; it's a responsibility. At Rootwave, we embrace this responsibility by innovating with nature, for nature."
      </blockquote>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 mt-8">
        Looking Ahead
      </h2>
      <p className="mb-6 text-lg leading-relaxed">
        The future is full of possibilities. We envision a world where sustainable choices are the default, not the alternative. Through this blog, we'll share updates on our projects, discuss challenges and opportunities in the green tech space, and highlight the incredible work being done by others in the sustainability community.
      </p>
      <p className="text-lg leading-relaxed">
        Thank you for joining us on this important journey. We look forward to sharing more with you soon!
      </p>
    </>
  );
}
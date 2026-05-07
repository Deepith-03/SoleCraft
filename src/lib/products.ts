import s1 from "@/assets/sneaker-1.jpg";
import s2 from "@/assets/sneaker-2.jpg";
import s3 from "@/assets/sneaker-3.jpg";
import s4 from "@/assets/sneaker-4.jpg";
import s5 from "@/assets/sneaker-5.jpg";
import s6 from "@/assets/sneaker-6.jpg";

export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  tag?: string;
  color: string;
};

export const products: Product[] = [
  { id: 1, name: "Air Jordan 1 Retro High OG 'Shadow'", brand: "Air Jordan", price: 180, image: s1, tag: "New", color: "Black" },
  { id: 2, name: "Pegasus Trail Knit Runner", brand: "Nike", price: 145, image: s2, color: "Green" },
  { id: 3, name: "Court Classic Suede Low", brand: "Adidas", price: 110, image: s3, tag: "Sale", color: "Tan" },
  { id: 4, name: "Wave Cloud Chunky 90s", brand: "New Balance", price: 165, image: s4, color: "Blue" },
  { id: 5, name: "Minimal Court Leather", brand: "Common Projects", price: 220, image: s5, color: "Black" },
  { id: 6, name: "Trail Pacer GTX", brand: "Hoka", price: 175, image: s6, tag: "New", color: "Grey" },
];

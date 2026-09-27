import { cars, getCar, decodeSegment } from "@/lib/cars";
import { ogImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => [
  { slug: "site" },
  ...cars.map((c) => ({ slug: c.slug })),
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const slug = decodeSegment((await params).slug);
  if (slug === "site") return ogImage();
  const car = getCar(slug);
  if (!car) return new Response("Not found", { status: 404 });
  return ogImage(car);
}

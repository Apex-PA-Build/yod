import { estimateDelivery } from "@/features/delivery/estimate";

export async function GET(request: Request) {
  const pin = new URL(request.url).searchParams.get("pin");
  const estimate = estimateDelivery(pin);
  return Response.json(estimate, { status: estimate.ok ? 200 : 400 });
}

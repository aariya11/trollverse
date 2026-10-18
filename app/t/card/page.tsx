import type { Metadata } from "next";
import { PrankRoute } from "@/components/share/PrankRoute";
import { CardPrank } from "@/components/share/CardPrank";

export const metadata: Metadata = {
  title: "A card has arrived",
  robots: { index: false, follow: false },
};

export default function CardPrankPage(props: PageProps<"/t/card">) {
  return (
    <PrankRoute
      kind="card"
      searchParams={props.searchParams}
      banner={(payload) =>
        payload.tone === "compliment" ? "Anonymous compliment" : "Friendly prank: reveal card"
      }
      render={(payload) => <CardPrank payload={payload} />}
    />
  );
}

import type { Metadata } from "next";
import { PrankRoute } from "@/components/share/PrankRoute";
import { AwardPrank } from "@/components/share/AwardPrank";

export const metadata: Metadata = {
  title: "An award has been issued",
  robots: { index: false, follow: false },
};

export default function AwardPrankPage(props: PageProps<"/t/award">) {
  return (
    <PrankRoute
      kind="award"
      searchParams={props.searchParams}
      banner={() => "Friendly prank: silly award"}
      render={(payload) => <AwardPrank payload={payload} />}
    />
  );
}

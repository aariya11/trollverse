import type { Metadata } from "next";
import { PrankRoute } from "@/components/share/PrankRoute";
import { LoadingPrank } from "@/components/share/LoadingPrank";

export const metadata: Metadata = {
  title: "A loading screen, probably",
  robots: { index: false, follow: false },
};

export default function LoadingPrankPage(props: PageProps<"/t/loading">) {
  return (
    <PrankRoute
      kind="load"
      searchParams={props.searchParams}
      banner={() => "Friendly prank: fake loading"}
      render={(payload) => <LoadingPrank payload={payload} />}
    />
  );
}

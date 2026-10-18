import type { Metadata } from "next";
import { PrankRoute } from "@/components/share/PrankRoute";
import { DramaPrank } from "@/components/share/DramaPrank";

export const metadata: Metadata = {
  title: "Breaking news, allegedly",
  robots: { index: false, follow: false },
};

export default function DramaPrankPage(props: PageProps<"/t/drama">) {
  return (
    <PrankRoute
      kind="drama"
      searchParams={props.searchParams}
      banner={() => "Friendly prank: fake news"}
      render={(payload) => <DramaPrank payload={payload} />}
    />
  );
}

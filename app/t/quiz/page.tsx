import type { Metadata } from "next";
import { PrankRoute } from "@/components/share/PrankRoute";
import { QuizPrank } from "@/components/share/QuizPrank";

export const metadata: Metadata = {
  title: "A quiz duel awaits",
  robots: { index: false, follow: false },
};

export default function QuizPrankPage(props: PageProps<"/t/quiz">) {
  return (
    <PrankRoute
      kind="quiz"
      searchParams={props.searchParams}
      banner={() => "Friendly prank: quiz duel"}
      render={(payload) => <QuizPrank payload={payload} />}
    />
  );
}

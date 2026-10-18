import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Bits";
import {
  decodePayload,
  type AwardPayload,
  type CardPayload,
  type DramaPayload,
  type LoadPayload,
  type QuizPayload,
} from "@/lib/share";
import { BrokenLink, ShareBanner } from "./ShareChrome";

type KindMap = {
  card: CardPayload;
  award: AwardPayload;
  load: LoadPayload;
  drama: DramaPayload;
  quiz: QuizPayload;
};

interface PrankRouteProps<K extends keyof KindMap> {
  kind: K;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  banner: (payload: KindMap[K]) => string;
  render: (payload: KindMap[K]) => React.ReactNode;
}

async function PrankBody<K extends keyof KindMap>({ kind, searchParams, banner, render }: PrankRouteProps<K>) {
  const params = await searchParams;
  const payload = decodePayload(typeof params.d === "string" ? params.d : null);

  if (!payload || payload.k !== kind) return <BrokenLink />;

  const typed = payload as KindMap[K];
  return (
    <>
      <ShareBanner kindLabel={banner(typed)} />
      {render(typed)}
    </>
  );
}

export function PrankRoute<K extends keyof KindMap>(props: PrankRouteProps<K>) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-xl px-4 pb-16 pt-6">
          <Skeleton className="h-44 w-full rounded-3xl" />
        </div>
      }
    >
      <PrankBody {...props} />
    </Suspense>
  );
}

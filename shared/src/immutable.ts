type Draftable = { [K: string | symbol | number]: any };

type Draft<G extends Draftable> = {
  -readonly [K in keyof G]: G[K];
};

export function produce<G extends Draftable>(
  immutable: G,
  mutator: (draft: Draft<G>) => void
): G {
  const draft = structuredClone(immutable) as Draft<G>;
  mutator(draft);
  return draft;
}

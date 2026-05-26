import { SEGMENT_SEEDS, type SegmentSeed } from "@/lib/db/seed/segments.seed";

export type Segment = SegmentSeed;

export function listSegments(): Segment[] {
  return SEGMENT_SEEDS;
}

export function getSegment(id: number): Segment | null {
  return SEGMENT_SEEDS.find((s) => s.id === id) ?? null;
}

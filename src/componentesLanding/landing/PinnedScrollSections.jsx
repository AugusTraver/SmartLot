import ParkingStructureSection from './ParkingStructureSection';
import RoleJourney from './RoleJourney';

// ParkingStructureSection and RoleJourney are two sequential GSAP
// ScrollTrigger pins: RoleJourney's start position depends on
// ParkingStructureSection's pin already being established (its pin-spacer
// reserves the scroll distance RoleJourney's own trigger measures from).
// If each were lazy-loaded behind its own independent Suspense boundary,
// their chunks could resolve — and their effects run, creating each
// ScrollTrigger — in whichever order the network happens to finish in.
// When RoleJourney's pin gets created before ParkingStructureSection's has
// run, it measures a stale (unpinned) height above it, and no later
// ScrollTrigger.refresh() call fully corrects a pin created against the
// wrong sequence. Bundling both in one static-import module behind a single
// Suspense boundary guarantees they mount in the same commit, in this file's
// order, so their ScrollTrigger.create() calls always run Parking-then-Role.
export default function PinnedScrollSections() {
  return (
    <>
      <ParkingStructureSection />
      <RoleJourney />
    </>
  );
}

/** Gradient overlays for the hero background video (video element lives in Home). */
export function HeroVideoOverlay() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.28))',
        }}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black/55 to-transparent sm:h-48" />
    </>
  )
}

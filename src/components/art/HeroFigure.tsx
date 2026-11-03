// Disable this first if the SVG displacement is expensive on a target device.
const ENABLE_RIPPLE = true;

export function HeroFigure() {
  return (
    <>
      <div className="hero-figure" data-ripple={ENABLE_RIPPLE}>
        <div className="hero-figure__halo" aria-hidden="true" />
        <img
          className="hero-figure__art"
          src="/img/hero-figure.webp"
          alt="Classical Indian dancer in namaste pose, ink and watercolor illustration"
          width="760"
          height="1155"
          fetchPriority="high"
          draggable={false}
          data-aura-figure
        />
        <div className="hero-figure__flecks" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => <span key={index} />)}
        </div>
        {ENABLE_RIPPLE && (
          <svg className="hero-figure__filter" width="0" height="0" aria-hidden="true">
            <defs>
              <filter id="hf-ripple" x="-5%" y="-5%" width="110%" height="110%">
                <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="2" seed="4" result="noise">
                  <animate attributeName="baseFrequency" dur="14s" repeatCount="indefinite" values="0.006 0.009;0.009 0.006;0.006 0.009" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>
        )}
      </div>
    </>
  );
}

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CtaBanner() {
  return (
    <section className="relative z-1 py-24">
      <div className="content-container">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-400/5 via-transparent to-transparent border border-yellow-400/10 grid grid-cols-1 md:grid-cols-2 gap-10 px-8 md:px-16 py-14">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
              ¿Listo para activar<br />
              tu <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">licencia</span>?
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6 text-sm md:text-base">
              Miles de usuarios ya confían en nosotros. Únete al reino digital y obtén tus licencias al mejor precio del mercado colombiano.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                "Activación inmediata",
                "Soporte 24/7",
                "Mejor precio",
                "Garantía total",
              ].map((feat) => (
                <span
                  key={feat}
                  className="text-xs text-gray-500 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-1.5"
                >
                  <span className="text-green-400">✓</span>
                  {feat}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-end text-right relative z-10">
            <div className="font-mono text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent leading-none mb-1">
              $9.90
            </div>
            <div className="text-gray-500 text-sm mb-6">
              desde — licencias desde $9.90 USD
            </div>
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-b from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 hover:-translate-y-0.5 transition-all"
            >
              👑 Ir a la Tienda
              <span>→</span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

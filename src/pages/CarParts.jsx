import { useEffect, useState } from "react";

export default function CarParts() {
  const [parts, setParts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadParts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("https://api.jsonbin.io/v3/b/69e535e236566621a8ce210a", {
          headers: {
            "X-Access-Key": import.meta.env.VITE_JSONBIN_ACCESS_KEY,
          },
        });
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log(data); 

        setParts(data.record.articles || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar los repuestos");
      } finally {
        setIsLoading(false);
      }
    };

    loadParts();
  }, []);

  return (
    <div className="container">
      <h2>Repuestos de Carro</h2>

      {isLoading && (
        <div className="state-message loading">
          <p>⏳ Cargando repuestos...</p>
        </div>
      )}

      {error && (
        <div className="state-message error">
          <p>❌ Error: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}

      {!isLoading && !error && parts.length === 0 && (
        <div className="state-message empty">
          <p>📦 No hay repuestos disponibles</p>
        </div>
      )}

      {!isLoading && !error && parts.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Buscar por nombre del repuesto..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(10);
            }}
            className="search-input"
          />

          {parts
            .filter((part) =>
              part.articleProductName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ).length === 0 ? (
            <div className="state-message empty">
              <p>🔍 No se encontraron repuestos con "{searchTerm}"</p>
            </div>
          ) : (
            <>
              {parts
                .filter((part) =>
                  part.articleProductName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .slice(0, visibleCount)
                .map((part) => (
                  <div key={part.articleId} className="card">
                    <h3>{part.articleProductName}</h3>
                    <p>Proveedor: {part.supplierName}</p>
                    <p>Código: {part.articleNo}</p>

                    {part.s3image && (
                      <img
                        src={part.s3image}
                        alt={part.articleProductName}
                        width="150"
                      />
                    )}
                  </div>
                ))}

              {visibleCount < parts.filter((part) =>
                part.articleProductName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ).length && (
                <button onClick={() => setVisibleCount(visibleCount + 10)}>
                  Ver más
                </button>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
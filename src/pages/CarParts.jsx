import { useEffect, useState } from "react";

export default function CarParts() {
  const [parts, setParts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://api.jsonbin.io/v3/b/69e535e236566621a8ce210a", {
      headers: {
        "X-Access-Key": import.meta.env.VITE_JSONBIN_ACCESS_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data); 

        setParts(data.record.articles); 
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <h2>Repuestos de Carro </h2>

      <input
        type="text"
        placeholder="Buscar por nombre del repuesto..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setVisibleCount(10);
        }}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />

      {parts.length === 0 ? (
        <p>Cargando...</p>
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
    </div>
  );
}
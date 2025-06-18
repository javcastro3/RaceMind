const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/sesiones", async (req, res) => {
  const { anio, pais } = req.query;

  try {
    const response = await axios.get(`https://api.openf1.org/v1/sessions`, {
      params: {
        year: anio,
        country_name: pais
      }
    });

    const sesiones = response.data;

    res.json({ sesiones });
  } catch (error) {
    console.error("Error al obtener sesiones:", error.message);
    res.status(500).json({ error: "Error al consultar OpenF1" });
  }
});

app.get("/resultados", async (req, res) => {
  const { anio, pais, sesion } = req.query;

  try {
    // 1. Posiciones finales
    const posicionesResponse = await axios.get(`https://api.openf1.org/v1/position`, {
      params: { session_key: sesion }
    });

    // 2. Pilotos filtrados por esa sesión
    const driversResponse = await axios.get(`https://api.openf1.org/v1/drivers`, {
      params: { session_key: sesion }
    });

    const posiciones = posicionesResponse.data;
    const drivers = driversResponse.data;

    // Última posición registrada por piloto
    const ultimasPosiciones = {};
    posiciones.forEach((registro) => {
      const piloto = registro.driver_number;
      if (
        !ultimasPosiciones[piloto] ||
        new Date(registro.date) > new Date(ultimasPosiciones[piloto].date)
      ) {
        ultimasPosiciones[piloto] = registro;
      }
    });

    const clasificacionFinal = Object.values(ultimasPosiciones)
      .filter(p => p.position !== null)
      .sort((a, b) => a.position - b.position)
      .map((p) => {
        const infoPiloto = drivers.find(d => d.driver_number === p.driver_number) || {};
        return {
          piloto: p.driver_number,
          posicion: p.position,
          tiempo: p.date,
          team_name: infoPiloto.team_name || "Desconocido",
          nombre: infoPiloto.full_name || "N/D"
        };
      });

    res.json({ pais, anio, sesion, resultado_final: clasificacionFinal });
  } catch (error) {
    console.error("Error al obtener resultado final:", error.message);
    res.status(500).json({ error: "Error al procesar el resultado final" });
  }
});


app.get("/clima", async (req, res) => {
  const ciudad = req.query.ciudad;

  try {
    // Aquí puedes usar cualquier API pública, como OpenWeather (requiere API key)
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=40.4168&longitude=-3.7038&current_weather=true`);
    
    // Aquí transformas la respuesta para que sea clara para el GPT
    const clima = response.data.current_weather;

    res.json({
      ciudad,
      temperatura: clima.temperature,
      viento: clima.windspeed,
      condiciones: "Información simplificada para el GPT"
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Error al obtener el clima" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor API listo para GPT");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

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
	console.log(`const: ` const);
	const sesiones = response.data;

    // Mapeamos solo los datos relevantes
    const resultado = sesiones.map(s => ({
      meeting_key: s.meeting_key,
      session_key: s.session_key,
      session_name: s.session_name,
      date: s.date,
      circuito: s.circuit_short_name
    }));

    res.json({
      pais,
      anio,
      sesiones: resultado
    });
    });
	} catch (error) {
    console.error("Error al obtener datos de OpenF1:", error.message);
    res.status(500).json({ error: "Error al consultar OpenF1" });
  }
})

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

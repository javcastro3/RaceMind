const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

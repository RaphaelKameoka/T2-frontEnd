const express = require('express');
const request = require('request');

const clima = express();


clima.get('/', (req, res) => {
    let cidade = req.query.cidade;
    let estado = req.query.estado;
    let pais = req.query.pais;
    
    const link_openweather_geo = `http://api.openweathermap.org/geo/1.0/direct?q=$${cidade},$${estado},$${pais}&limit=1&appid=ee5fe5a605182416747d733c74bc0520`;
    request(link_openweather_geo, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const coordenadas = JSON.parse(body);
            if (coordenadas.length > 0) {
                const latitude = coordenadas[0].lat;
                const longitude = coordenadas[0].lon;
                // res.json(`Cidade de ${cidade} com coordenadas de ${latitude}, ${longitude}`);
                const link_openweather_current = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ee5fe5a605182416747d733c74bc0520`
                request(link_openweather_current, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        const weather = JSON.parse(body);
                        if (weather) {
                            const feels_like = weather.main.feels_like;
                            const description = weather.weather[0].description;
                            res.json(`Cidade de ${cidade} com sensação térmica de ${(feels_like - 273).toFixed(2)} °C Descrição: ${description}`);
                        } else {
                            res.status(404).send('Local não encontrado <br> Link de exemplo: http://localhost:3000/?cidade=nome_cidade&estado=codigo_estado&pais=codigo_pais');
            
                        }
                    } else {
                        res.status(500).send('Erro ao buscar dados de localização');
                    }
                });  
            } else {
                res.status(404).send('Local não encontrado <br> Link de exemplo: http://localhost:3000/?cidade=nome_cidade&estado=codigo_estado&pais=codigo_pais');

            }
        } else {
            res.status(500).send('Erro ao buscar dados de localização');
        }
    });
});

clima.listen(3000, () => console.log('Servidor iniciado na porta 3000'))
const express = require('express');
const axios = require('axios');

const app = express();

app.set('views engine', 'pug');
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const private_app_token = 'pat-na1-1770bfef-eb81-42b7-8a24-d3d70061cb97';

app.get('/animais', async (req, res) => {
    const Animais = "https://api.hubapi.com/crm/v3/objects/2-21296903/?properties=nome&properties=idade&properties=raca";
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.get(Animais, { headers });
        console.log('Resposta HubSpot:', response.data);
        const data = response.data.results.map(result => result.properties);
        console.log('Dados finais:', data);  
        res.render('contacts', { title: 'Animais | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/update-cobj', async (req, res) => {
    try {
        const response = await axios.get("https://api.hubapi.com/crm/v3/objects/2-21296903/?properties=nome&properties=idade&properties=raca", {
            headers: {
                Authorization: `Bearer ${private_app_token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = response.data.results.map(result => result.properties);

        console.log('Dados:', data);

        res.render('update-cobj', { title: 'Atualizar Registro | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update-cobj', async (req, res) => {
    const formData = req.body;
    console.log(formData);

    try {
        const newContact = {
            properties: {
                "nome": formData.nome,
                "idade": formData.idade,
                "raca": formData.raca
            }
        };

        const createContactURL = 'https://api.hubapi.com/crm/v3/objects/2-21296903';
        
        const headers = {
            Authorization: `Bearer ${private_app_token}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.post(createContactURL, newContact, { headers });

        // O ID do novo contato pode ser obtido a partir da resposta
        const newContactId = response.data.id;

        res.redirect('/animais');  
    } catch (error) {
        console.error(error);
        res.status(500).send(error.response ? error.response.data : 'Erro ao criar novo registro no CRM');
    }
});


app.get('/', async (req, res) => {
    try {
        const response = await axios.get("https://api.hubapi.com/crm/v3/objects/2-21296903/?properties=nome&properties=idade&properties=raca", {
            headers: {
                Authorization: `Bearer ${private_app_token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = response.data.results.map(result => result.properties);

        res.render('homepage', { title: 'Página Inicial | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(3000, () => console.log('Listening on http://localhost:3000'));

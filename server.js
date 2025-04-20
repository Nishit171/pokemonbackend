const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://desainishit17:sq2dS51F4u5k0pYt@cluster0.eqyv4.mongodb.net/pokemonDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Pokemon Schema
const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: String,
  types: [String],
  sprite: String,
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

// Routes
// Get one pokemon by name
app.get("/", (req, res) => {
    res.send("✅ Server is alive and working!");
  });
  app.get('/api/pokemons', async (req, res) => {
    const allPokemon = await Pokemon.find({});
    res.json(allPokemon);
  });
  app.get('/api/pokemons/:name', async (req, res) => {
    const { name } = req.params;
    try {
      const pokemon = await Pokemon.findOne({
        name: { $regex: `^${name}$`, $options: 'i' }  // 'i' = case insensitive
      });
      if (pokemon) {
        res.json(pokemon);
      } else {
        res.status(404).json({ message: 'Pokemon not found' });
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Error fetching pokemon' });
    }
  });
  
  

// Get multiple pokemon by names (case-insensitive)
app.post('/api/pokemon', async (req, res) => {
  const { names } = req.body;
  try {
    const regexNames = names.map(name => new RegExp(`^${name}$`, 'i')); // case-insensitive
    const pokemons = await Pokemon.find({ name: { $in: regexNames } });
    res.json(pokemons);
  } catch (err) {
    console.error('Error fetching pokemons:', err);
    res.status(500).json({ error: 'Error fetching pokemons' });
  }
});

// Get Pokémon by type
app.get('/api/pokemons/type/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const pokemons = await Pokemon.find({ types: type });
    res.json(pokemons);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching Pokémon by type' });
  }
});


// Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

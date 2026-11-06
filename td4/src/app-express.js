import express from 'express';
import morgan from 'morgan';
import { 
  listerContacts, 
  obtenirContact, 
  ajouterContact, 
  modifierContact, 
  supprimerContact 
} from './mongo.js';
import path from 'path';

process.loadEnvFile();
const host = process.env.HOST;
const port = process.env.PORT;

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(process.cwd(), 'src', 'views'));
app.set('view engine', 'ejs');
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await listerContacts();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Erreur lors de la récupération des contacts" });
  }
});

// 2. GET /contacts/:id : Obtenir un contact par son ID
app.get('/contacts/:id', async (req, res) => {
  try {
    const contact = await obtenirContact(req.params.id);
    if (!contact) {
      return res.status(404).json({ erreur: "Contact non trouvé" });
    }
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Erreur serveur" });
  }
});

// 3. POST /contacts : Ajouter un nouveau contact (retourne le contact créé)
app.post('/contacts', async (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || age === undefined) {
      return res.status(400).json({ erreur: "Les champs 'name' et 'age' sont requis" });
    }

    const nouveauContact = await ajouterContact({ name, age: Number(age) });
    res.status(201).json(nouveauContact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Erreur lors de la création du contact" });
  }
});

// 4. PUT /contacts/:id : Mettre à jour un contact
app.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age } = req.body;

    if (!name || age === undefined) {
      return res.status(400).json({ erreur: "Les champs 'name' et 'age' sont requis" });
    }

    const modifie = await modifierContact(id, { name, age: Number(age) });
    if (!modifie) {
      return res.status(404).json({ erreur: "Contact non trouvé ou non modifié" });
    }

    const contactMisAJour = await obtenirContact(id);
    res.json(contactMisAJour);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Erreur lors de la mise à jour" });
  }
});

// 5. DELETE /contacts/:id : Supprimer un contact
app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supprime = await supprimerContact(id);

    if (!supprime) {
      return res.status(404).json({ erreur: "Contact non trouvé" });
    }

    res.json({ message: "Contact supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: "Erreur lors de la suppression" });
  }
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
});

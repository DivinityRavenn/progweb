const DABASE_NAME = 'M2WEB'
const collection  = 'contacts'
const MONGO_URL = 'mongodb://localhost:27017';

import { MongoClient,ObjectId } from 'mongodb';

const client = new MongoClient(MONGO_URL);

async function getCollection() {
  await client.connect();
  const db = client.db(DABASE_NAME);
  return db.collection('contacts');
}

/**
 * 1. Lister tous les contacts
 */
export async function listerContacts() {
  const collection = await getCollection();
  return await collection.find().toArray();
}

/**
 * 2. Obtenir les informations d'un contact grâce à son ID
 */
export async function obtenirContact(id) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getCollection();
  return await collection.findOne({ _id: new ObjectId(id) });
}

/**
 * 3. Ajouter un nouveau contact (retourne le contact créé avec son _id)
 */
export async function ajouterContact(donnees) {
  const collection = await getCollection();
  const result = await collection.insertOne(donnees);
  return { _id: result.insertedId, ...donnees };
}

/**
 * 4. Mettre à jour un contact (dépend de l'ID)
 */
export async function modifierContact(id, donnees) {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: donnees }
  );
  return result.modifiedCount > 0;
}

/**
 * 5. Supprimer un contact (dépend de l'ID)
 */
export async function supprimerContact(id) {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
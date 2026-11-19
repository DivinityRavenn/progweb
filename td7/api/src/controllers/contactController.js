import Contact from '../models/contactModel.js';
import redisClient from '../config/redis.js';

const ALL_CONTACTS_KEY = 'all_contacts';
// Get all contacts

export async function getAllContacts() {
  try{
    const cachedData=await redisClient.get(ALL_CONTACTS_KEY);
    if (cachedData){
      console.log("cache used");
      return JSON.parse(cachedData);
    }
    let total = await Contact.countDocuments({});
    let limit = parseInt(total);
    const contacts = await Contact.find().limit(limit);
    const response= {
      success: true,
      data: contacts,
      total: total.toString(),
    };
    redisClient.set(ALL_CONTACTS_KEY,JSON.stringify(response),{EX:3600});
    return response;
  } catch (err) {
    return { success: false, message: "Contacts not found " + err };
  }
}

// Get contact by Id
export async function getContactById(id) {
  const cacheKey="contact:${id}";
  try {
    const cachedData=await redisClient.get(cacheKey);
    if (cachedData){
      return JSON.parse(cachedData);
    }
    const contact = await Contact.findById(id);
    if (!contact) {
      return { success: false, message: "Contact not found" };
    }
    redisClient.set(cacheKey,JSON.stringify(contact),{EX:3600});
    return { success: true, data: contact };
  } catch (err) {
    return { success: false, message: "Error finding contact " + err };
  }
}

// Add a new contact, returns the added contact
export async function addContact(body) {
  try {
    const contact = new Contact(body);
    await contact.save();
    redisClient.del(ALL_CONTACTS_KEY);
    return { success: true, data: contact };
  } catch (err) {
    return { success: false, message: "Error adding contact " + err };
  }
}

// Update an existing contact
export async function updateContact(id, name = null, age = null) {
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return { success: false, message: "Contact not found" };
    }
    if (name !== null) contact.name = name;
    if (age !== null) contact.age = age;
    await contact.save();
    redisClient.del(ALL_CONTACTS_KEY,"contact:${id}");
    return { success: true, data: contact };
  } catch (err) {
    return { success: false, message: "Error updating contact " + err };
  }
}


// Remove an existing contact
export async function removeContact(id) {
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return { success: false, message: "Contact not found" };
    }
    redisClient.del(ALL_CONTACTS_KEY,"contact:${id}");
    return { success: true, message: "Contact deleted successfully" };
  } catch (err) {
    return { success: false, message: "Error deleting contact " + err };
  }
}

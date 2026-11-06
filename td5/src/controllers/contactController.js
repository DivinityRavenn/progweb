
import Contact from '../models/contactModel.js';

// Get all contacts
export async function getAllContacts() {
    let total = await Contact.countDocuments({});
    let limit = parseInt(total);

    try {
        const contacts = await Contact.find().limit(limit);
        return {
            success: true,
            data: contacts,
            total: total.toString(),
        }
    } catch (err) {
        return { success: false, message: "Contacts not found " + err };
    }
}

// Get contact by Id
export async function getContactById(id) {
  try{
    const contact = await Contact.findById(id);
    return {success : true, data: contact, message : "contact found "};
  }catch (err){
    return {success: false, message : "contacts not found "+err};
  }
}

// Add a new contact, returns the added contact
export async function addContact(body) {
  try {
    const addedContact = Contact.create(body);
    return {
            success: true,
            data: newContact,
            message: "Contact créé avec succès"
        };
  }catch(err){
    return {success : false, message : "contact cannot be added"};
  }
}
 
// Update an existing contact
export async function updateContact(id, name = null, age = null) {
   try {
      const response =await Contact.findByIdAndUpdate(id,{name,age},{new:true});
      return {success :true,data : response , message: "contact has been updated" };
   } catch (error) {
    return {success : false , message : "contact cannot be update"}
   }
}
    
// Remove an existing contact
export async function removeContact(id) {
  try {
    const response= await Contact.findByIdAndDelete(id,{new:true});
    if (response==null){
      return {success :false , message : "The contact do not exist"}; 
    }
    return {success :true,data: response, message : "The contact has been removed"};
  } catch (error) {
     return {success :false , data: error, message : "The contact has not been removed"};
  }
}

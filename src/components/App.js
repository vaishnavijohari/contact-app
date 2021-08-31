import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { uuid } from 'uuidv4';
import './App.css';
import api from '../api/contacts';
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import ContactDetail from './ContactDetail';
import EditContact from "./EditContact";

function App() {
  const LOCAL_STORAGE_KEY = "contacts";
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  //RetrieveContacts function
  const retreiveContacts = async () => {
      const response = await api.get("/contacts");
      return response.data;
  };

  const searchHandler = (searchTerm) => {
    setSearchTerm(searchTerm);
    if(searchTerm !== ""){
      const newContactList = contacts.filter((contact) => {
      return Object.values(contact).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
      })
      setSearchResults(newContactList);
    }
    else{
      setSearchResults(contacts);
    }
  };

  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact
    }
    
    const response = await api.post("/", request);
    console.log(response);
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) => {
    const response = await api.put(`/${contact.id}` , contact);
    const { id, name, email } = response.data;
    setContacts(
      contacts.map((contact) => {
        return (contact.id === id) ? {...response.data} : contact;
    })
    );
  };

  const removeContactHandler = async (id) => {
    await api.delete(`/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  useEffect(() => {
    //const retreiveContacts = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    //if(retreiveContacts) setContacts(retreiveContacts);
    const getAllContacts = async () => {
      const allContacts = await retreiveContacts();
      if(allContacts) setContacts(allContacts);
    }
    getAllContacts();
  },[]);

  useEffect(() => {
    //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  },[contacts]);

  return (
    <div className="ui container">
      <Router>
        <Header />
        <Switch>
        <Route path="/add"    render = { (props) => (
          <AddContact {...props} addContactHandler={addContactHandler}/> )}/>
        <Route path="/" exact render = { (props) => (
          <ContactList {...props} contacts={searchTerm.length < 1 ? contacts : searchResults} getContactId={ removeContactHandler } 
            term={searchTerm}
            searchKeyword={searchHandler}
          />
        )}
          />
         <Route path="/edit"    render = { (props) => (
          <EditContact {...props} updateContactHandler={updateContactHandler}/> )}/>

          <Route path="/contact/:id" component={ContactDetail} />
        </Switch>
        
        
      </Router>
      
    </div>
  );
}

export default App;

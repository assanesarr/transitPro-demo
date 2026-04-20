import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

const USERS_DB = [
  { id: 1, nom: "Moussa Diaw", prenom: "Moussa", email: "admin@transitpro.sn", password: "admin123", role: "Administrateur", poste: "Transitaire senior", avatar: "MD", actif: true },
  { id: 2, nom: "Awa Sarr", prenom: "Awa", email: "awa@transitpro.sn", password: "awa123", role: "Transitaire", poste: "Transitaire", avatar: "AS", actif: true },
  { id: 3, nom: "Ibou Faye", prenom: "Ibou", email: "ibou@transitpro.sn", password: "ibou123", role: "Agent douanier", poste: "Agent douanier", avatar: "IF", actif: true },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const foundUser = USERS_DB.find(u => u.email === email && u.password === password && u.actif);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "Administrateur" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
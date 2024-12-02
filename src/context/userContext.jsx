import React, { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const login = (userData) => {
    setUser(userData);
    loadUserData();
  };

  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFavorites(parsedUser.favorites || []);
      setRecipes(parsedUser.recipes || []);
    }
  };

  const addRecipe = (newRecipe) => {
    setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
    updateUserData();
  };

  const deleteRecipe = (recipeId) => {
    const updatedRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
    setRecipes(updatedRecipes);
    updateUserData();
  };

  const addFavorite = (recipe) => {
    setFavorites((prevFavorites) => [...prevFavorites, recipe]);
    updateUserData();
  };

  const removeFavorite = (recipeId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== recipeId);
    setFavorites(updatedFavorites);
    updateUserData();
  };

  const updateUserData = () => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        recipes,
        favorites,
      })
    );
  };
  const logout = () => {
    setUser(null);
    setFavorites([]);
    setRecipes([]);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        favorites,
        recipes,
        addRecipe,
        deleteRecipe,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => React.useContext(UserContext);

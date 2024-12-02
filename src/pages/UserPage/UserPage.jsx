import React, { useState, useEffect } from "react";
import { useUserContext } from "../../context/userContext";
import "./UserPage.scss";
import { useNavigate } from "react-router-dom";
import MealList from "../../components/Meal/MealList";
//import axios from '../../api/axios';

const UserPage = () => {
  const {
    user,
    login,
    logout,
    favorites = [],
    recipes = [],
    addRecipe,
    deleteRecipe,
    addFavorite,
    removeFavorite,
  } = useUserContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);
  const [isFavoritesView, setIsFavoritesView] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data) {
      login({ username, password });
      setMessage("Registration successful! You are now logged in.");
      alert("Registration successful! You are now logged in.");
      navigate("/");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();
      const foundUser = users.find(
        (user) => user.username === username && user.password === password
      );
      if (foundUser) {
        login(foundUser);
        setMessage("Login successful!");
        navigate("/");
      } else {
        setMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("An error occurred. Please try again later.");
    }
  };

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    const newRecipeToAdd = { ...newRecipe, id: Date.now() };
    addRecipe(newRecipeToAdd);
    setNewRecipe({ name: "", ingredients: "", instructions: "", image: "" });
    setIsAddingRecipe(false);
  };

  const handleToggleFavorite = async (recipe) => {
    if (favorites.some((fav) => fav.id === recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };
  const handleToggleFavoritesView = () => {
    setIsFavoritesView((prev) => {
      console.log("Toggling favorites view:", !prev);
      return !prev;
    });
  };

  const handleDeleteRecipe = async (recipeId) => {
    deleteRecipe(recipeId);
  };

  const handleDeleteFavorite = async (recipeId) => {
    removeFavorite(recipeId);
  };
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get("/");
        setMeals(response.data.meals);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="user-page">
      {!user ? (
        <>
          <div className="auth-container">
            <h2>{isLoginMode ? "User Login" : "User Registration"}</h2>
            {!isLoginMode ? (
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit">Register</button>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
            )}
            <button onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode
                ? "Switch to Registration"
                : "Already an existing user?"}
            </button>
            {message && <p>{message}</p>}
          </div>
        </>
      ) : (
        <div className="user-info-container">
          <h2>Welcome, {user.username}</h2>
          <div className="user-actions">
            <button
              onClick={
                /*() => setIsFavoritesView(!isFavoritesView)*/ handleToggleFavoritesView
              }
            >
              {isFavoritesView ? "View All Recipes" : "View Favorites"}
            </button>
            <button onClick={() => setIsAddingRecipe(!isAddingRecipe)}>
              {isAddingRecipe ? "Cancel" : "Add Recipe"}
            </button>
            <button onClick={logout}>Logout</button>
          </div>

          {isAddingRecipe && (
            <form onSubmit={handleAddRecipe} className="add-recipe-form">
              <div className="form-group">
                <label htmlFor="name">Recipe Name:</label>{" "}
                <input
                  type="text"
                  id="name"
                  value={newRecipe.name}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="ingredients">Ingredients:</label>{" "}
                <textarea
                  id="ingredients"
                  value={newRecipe.ingredients}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, ingredients: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="instructions">Instructions:</label>{" "}
                <textarea
                  id="instructions"
                  value={newRecipe.instructions}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, instructions: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="image">Image URL:</label>{" "}
                <input
                  type="text"
                  id="image"
                  value={newRecipe.image}
                  onChange={(e) =>
                    setNewRecipe({ ...newRecipe, image: e.target.value })
                  }
                />
              </div>
              <button type="submit">Add Recipe</button>
            </form>
          )}
          <div className="recipe-list">
            {(isFavoritesView ? favorites : recipes).map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <h3>{recipe.name}</h3>
                {recipe.image && (
                  <img
                    className="added-img"
                    src={recipe.image}
                    alt={recipe.name}
                  />
                )}{" "}
                <p>Ingredients: {recipe.ingredients}</p>
                <p>Instructions: {recipe.instructions}</p>
                <button onClick={() => handleToggleFavorite(recipe)}>
                  {favorites.some((fav) => fav.id === recipe.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
                <button onClick={() => handleDeleteRecipe(recipe.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;

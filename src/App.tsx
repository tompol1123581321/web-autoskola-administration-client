// import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContainer } from "./components/Layout/AppContainer";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppContainer>
          <Routes>
            <Route
              path="/"
              Component={() => {
                return "test1";
              }}
            />
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </>
  );
}

export default App;

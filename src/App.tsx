import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes
} from "react-router-dom";
import Login from "./components/Login";
import WhoAmI from "./components/WhoAmI";
import { useState } from "react";
import { AppContext, AppContextType } from "./utils/appContext";
import BillTable from "./components/BillTable";
import CreateBill from "./components/CreateBill";
import EditBill from "./components/EditBill";
import EditRecord from "./components/EditRecord";
import Home from "./components/Home";

function Root() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bills" element={<BillTable />} />
        <Route path="/bills/new" element={<CreateBill />} />
        <Route path="/bills/:id" element={<EditBill />} />
        <Route path="/records/edit/:id" element={<EditRecord />} />
        <Route path="/whoami" element={<WhoAmI />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
  const [context, setContext] = useState({
    loggedIn: false,
  });

  const setContextFunc = (value: Partial<AppContextType>) => {
    setContext((prevContext) => ({
      ...prevContext,
      ...value,
    }));
  };

  return (
    <AppContext.Provider value={{ ...context, setContextFunc }}>
      <RouterProvider router={router} />
    </AppContext.Provider>
  );
}

export default App;

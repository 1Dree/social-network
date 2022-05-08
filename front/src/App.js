import "./App.css";
import { FormProvider, HomeContextProvider } from "./contexts";
import {
  Signup,
  Login,
  UpdateProfile,
  NewPassword,
  Signout,
  privateRoute,
  ExpiredAccess,
} from "./components";
import { Home, AccountPage } from "./compounds";

import { Routes, Route } from "react-router-dom";

function App() {
  const [
    PrivateHome,
    PrivateUpdateProfile,
    PrivateSignout,
    PrivateAccountPage,
  ] = [
    privateRoute(Home),
    privateRoute(UpdateProfile),
    privateRoute(Signout),
    privateRoute(AccountPage),
  ];

  const PageNotFound = () =>
    "404 page not found. This page does not exist in this site.";

  return (
    <div id="app">
      <Routes>
        <Route path="/" element={<FormProvider />}>
          <Route index element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="new-password" element={<NewPassword />} />
          <Route path="update-profile" element={<PrivateUpdateProfile />} />
          <Route exact path="signout" element={<PrivateSignout />} />
          <Route exact path="account" element={<PrivateAccountPage />} />
        </Route>

        <Route
          exact
          path="/home"
          element={
            <HomeContextProvider>
              <PrivateHome />
            </HomeContextProvider>
          }
        />

        <Route exact path="expired-access" element={<ExpiredAccess />} />

        <Route exact path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;

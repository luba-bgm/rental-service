import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./components/app/app";
import { Setting } from "../const";
import { offers } from "./mocks/offers";
import { offersList } from "./mocks/offers-list";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <App
      rentalOffersCount={Setting.rentalOffersCount}
      offersList={offersList}
      offers={offers}
    />
  </StrictMode>
);
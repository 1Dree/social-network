import { useAside } from "../../contexts/AsideContext";
import "./searchbar.css";

const SearchBar = ({ localization }) => {
  const { setAsideSearchContent, setContactsSearchContent } = useAside();

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder={`search for a ${
          localization === "aside" ? "friend" : "contact"
        }`}
        onChange={e =>
          localization === "aside"
            ? setAsideSearchContent(e.target.value)
            : setContactsSearchContent(e.target.value)
        }
      />
    </div>
  );
};
export default SearchBar;

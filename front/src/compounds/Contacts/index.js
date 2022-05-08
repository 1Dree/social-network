import { Sidebar, SearchBar } from "../../components";

import { ScrollContainer } from "../../components";
import Contact from "./Contact";
import { useAside } from "../../contexts/AsideContext";
import { DataAbsence } from "../../components";
import useLoading from "../../lib/useLoading";

export default function Contacts() {
  const { contacts, contactsSearchContent, loadingData } = useAside();

  const contactMatrix = props => <Contact {...props} key={props._id} />;

  const uiContacts = contacts
    .filter(({ name }) =>
      name.toLowerCase().includes(contactsSearchContent.toLowerCase())
    )
    .map(contactMatrix);

  return (
    <Sidebar id="contacts" title="Contacts">
      <SearchBar localization="contacts" />

      <ScrollContainer firstName="contacts" style={{ height: "83%" }}>
        {loadingData.loading ? (
          <loadingData.LoadingComponent />
        ) : contacts.length ? (
          uiContacts
        ) : contactsSearchContent ? (
          <DataAbsence info="No results" />
        ) : (
          <DataAbsence info="There are no contacts to show." />
        )}
      </ScrollContainer>
    </Sidebar>
  );
}

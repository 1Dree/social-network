import "./accountpageprofile.css";
import { Profile } from "../../../components";
import { useUser } from "../../../contexts/UserContext";
import { useSocket } from "../../../contexts/SocketContext";
import API from "../../../API";
import { onDefineProfileObj } from "../../../API/apiLib";
import useLoading from "../../../lib/useLoading";

import EditIcon from "@mui/icons-material/Edit";

export default function AccountPageProfile() {
  const { user, setUser, socketAuth } = useUser();

  const { socket } = useSocket();
  const { loading, loadingStateSwitch, LoadingComponent } = useLoading();

  async function handlePhotoUpdate(e) {
    const file = e.target.files[0];
    if (!file.type.includes("image")) {
      alert("Wrong file type: it must be an image");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    loadingStateSwitch();

    try {
      let data = await API.account.onPhotoUpdate(user, formData);

      const defineProfileObj = onDefineProfileObj(data.accessToken);
      data = await defineProfileObj(data);

      setUser(prevState => ({
        ...prevState,
        login: {
          ...prevState.login,
          profile: data.profile,
        },
        tokens: { ...prevState.tokens, access: data.accessToken },
      }));

      socket.emit("broadcast_data", {
        header: {
          senderRoom: user.mailbox,
          receiverRoomEvent: "contact_photo_update",
          auth: socketAuth,
        },
        payload: {
          receiverData: {
            contact: {
              _id: user._id,
              profile: data.profile.path,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      loadingStateSwitch();
    }
  }

  const overlayIcon = (
    <label htmlFor="file" id="account-page-profile-overlay-icon">
      <EditIcon style={{ fontSize: "30px", color: "white" }} />
      <input
        type="file"
        id="file"
        accept="image/*"
        onChange={handlePhotoUpdate}
      />
    </label>
  );

  return (
    <div id="account-page-profile">
      <div id="account-page-profile-overlay">{overlayIcon}</div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <Profile src={user.login.profile.objectURL} />
      )}
    </div>
  );
}

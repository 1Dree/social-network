import { useChat } from "../../../../../contexts/ChatContext";
import { useUser } from "../../../../../contexts/UserContext";

const useFetchFile = assets => {
  const { user } = useUser();
  const { setObjectURLs } = useChat();

  const { content, type } = assets;

  return () => {
    assets.loadingStateSwitch();

    fetch(
      `${process.env.REACT_APP_SERVER_URL}chat/download-file?auth=${user.tokens.access}&filename=${content}`
    )
      .then(res => res.blob())
      .then(
        blob =>
          new Blob([blob], {
            type: `${type}/${content.match(/(?<=\.)[A-z]{0,}/g)[0]}`,
          })
      )
      .then(URL.createObjectURL)
      .then(objecturl => {
        assets.setFileObjectURL(objecturl);
        setObjectURLs(prevState => [...prevState, objecturl]);
      })
      .then(() => assets.loadingStateSwitch())
      .catch(console.log);
  };
};

export default useFetchFile;

export const onRes = async res => {
  const data = await res.json();

  if (res.status !== 200) throw new Error(data || res.statusText);

  if (data) return data;
};

export const onDefineProfileObj = accessToken => async subject => {
  try {
    const fetchSubjectPhoto = async ({ profile }) => {
      if (profile === "default") return "/default-profile.jpg";

      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}chat/download-file?auth=${accessToken}&filename=${profile}`
      );
      const blob = await res.blob();
      const newBlob = new Blob([blob], {
        type: `image/${profile.match(/(?<=\.)[A-z]{0,}/g)[0]}`,
      });

      return URL.createObjectURL(newBlob);
    };

    subject.profile = {
      path: subject.profile,
      objectURL: await fetchSubjectPhoto(subject),
    };

    return subject;
  } catch (err) {
    console.log(err);
  }
};

const apiLib = { onRes, onDefineProfileObj };

export default apiLib;

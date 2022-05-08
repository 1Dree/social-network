import "./filemsg.css";
import { WrappedLoading } from "../../../../../../components";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";

const onFileMsg = data => children => {
  const iconSize = { fontSize: "100px" };
  const iconTypes = {
    image: <ImageIcon style={iconSize} />,
    video: <VideoCameraBackIcon style={iconSize} />,
  };

  const Download = () => {
    return (
      <div className="download">
        <div className="download-content">
          <div className="download-content-icon prop">
            <div className="download-icon" onClick={data.fetchFile}>
              <DownloadIcon style={{ fontSize: "100px" }} />
            </div>
          </div>

          <div className="download-content-icon file">
            <div className="download-icon">{iconTypes[data.type]}</div>
          </div>
        </div>
      </div>
    );
  };

  return data.loading ? (
    <div className="loading-wrapper">
      <data.LoadingComponent />
    </div>
  ) : !data.fileObjectURL ? (
    <Download />
  ) : (
    <div className={data.type + "-container"}>{children}</div>
  );
};

export default onFileMsg;

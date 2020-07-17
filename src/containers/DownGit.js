import React, { useEffect, useReducer, useMemo } from "react";
import useLocation from "../hooks/useLocation";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "url-polyfill";
import { compose } from "../utils";

import Loading from "./Loading";
import Form from "./Form";

// initial State
const initialState = {
  isLoading: false,
  totalFiles: 0,
  downloadedFiles: 0,
  requestedPromises: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        ...action.payload
      };
      break;
    case "success":
      return {
        ...state,
        ...action.payload
      };
      break;
    case "downloading":
      const newRequestedPromise = [...state.requestedPromises, action.payload];
      return {
        ...state,
        requestedPromises: newRequestedPromise,
        totalFiles: newRequestedPromise.length
      };
      break;
    case "downloaded":
      return {
        ...state,
        downloadedFiles: action.payload
      };
      break;
    default:
      return { ...state };
      break;
  }
};

const DownGit = () => {
  const locationState = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const result = parseLocation(locationState);
  const templateUrl = "https?://github.com/.+/.+";

  const downloadFromUrl = compose(
    downloadZippedFiles,
    parseInfo
  );

  useEffect(() => {
    if (result.url.match(templateUrl)) {
      downloadFromUrl(result);
    }
  }, [locationState]);

  function parseLocation(location) {
    var url = new window.URL(location.href);
    var result = {};
    result.url = url.searchParams.get("url") || "";
    result.fileName = url.searchParams.get("fileName") || "";
    return result;
  }

  function parseInfo(parameters) {
    // `/jimczj/taro-zhihu/blob/master/src/asset/images`
    var repoPath = !!parameters.url && new window.URL(parameters.url).pathname;
    var splitPath = repoPath.split("/");
    var info = {};

    info.author = splitPath[1];
    info.repository = splitPath[2];
    info.branch = splitPath[4];

    info.rootName = splitPath[splitPath.length - 1];
    if (!!splitPath[4]) {
      info.restPath = repoPath.substring(
        repoPath.indexOf(splitPath[4]) + splitPath[4].length + 1
      );
    }
    info.urlPrefix = `https://api.github.com/repos/${info.author}/${
      info.repository
    }/contents/`;
    info.urlPostfix = `?ref=${info.branch}`;

    if (!parameters.fileName || parameters.fileName === "") {
      info.downloadFileName = info.rootName;
    } else {
      info.downloadFileName = parameters.fileName;
    }
    info.rootDirectoryName = info.rootName + "/";
    return info;
  }

  function downloadZippedFiles(repoInfo) {
    // 下载整个项目
    if (!repoInfo.restPath || repoInfo.restPath === "") {
      if (!repoInfo.branch || repoInfo.branch === "") {
        repoInfo.branch = "master";
      }

      var downloadUrl =
        "https://github.com/" +
        repoInfo.author +
        "/" +
        repoInfo.repository +
        "/archive/" +
        repoInfo.branch +
        ".zip";

      window.location = downloadUrl;
    } else {
      // 抓取目录下面的文件
      axios
        .get(repoInfo.urlPrefix + repoInfo.restPath + repoInfo.urlPostfix)
        .then(
          data => {
            console.log(data);
            if (Array.isArray(data.data)) {
              downloadDir(data.data, repoInfo);
            } else {
              downloadFile(data.data.download_url, repoInfo);
            }
          },
          err => {
            console.log("probable big file.");
            downloadFile(
              `https://raw.githubusercontent.com/${repoInfo.author}/${
                repoInfo.repository
              }/${repoInfo.branch}/${repoInfo.restPath}`
            );
          }
        );
    }
  }

  async function mapFileAndDirectory(dirPaths, repoInfo, filesArr) {
    console.log(dirPaths);
    const res = await axios.get(
      repoInfo.urlPrefix + dirPaths.pop() + repoInfo.urlPostfix
    );
    console.log(res, "from map");
    for (let i = res.data.length - 1; i >= 0; i--) {
      if (res.data[i].type === "dir") {
        dirPaths.push(res.data[i].path);
      } else {
        if (res.data[i].download_url) {
          const data = await getFile(
            res.data[i].path,
            res.data[i].download_url
          );
          filesArr.push(data);
          dispatch({ type: "downloaded", payload: filesArr.length });
        } else {
          console.log(res.data[i], "from dir");
        }
      }
    }

    if (dirPaths.length <= 0) {
      downloadFiles(filesArr, repoInfo);
    } else {
      mapFileAndDirectory(dirPaths, repoInfo, filesArr);
    }
  }

  function downloadFiles(filesArr, repoInfo) {
    console.log(filesArr);
    // start downloading
    const zip = new JSZip();
    filesArr.forEach(file => {
      console.log(file, repoInfo);
      zip.file(
        repoInfo.rootDirectoryName +
          file.path.substring(decodeURI(repoInfo.restPath).length + 1),
        file.data
      );
    });
    dispatch({ type: "success", payload: { isLoading: false } });
    zip.generateAsync({ type: "blob" }).then(content => {
      saveAs(content, repoInfo.downloadFileName + ".zip");
      window.history.pushState({}, null, "/");
    });
  }

  function getFile(path, url) {
    const promise = new Promise((resolve, reject) => {
      axios.get(url, { responseType: "arraybuffer" }).then(
        res => {
          resolve({ path: path, data: res.data });
        },
        err => console.log(err)
      );
    });

    dispatch({ type: "downloading", payload: promise });
    return promise;
  }

  function downloadDir(files, repoInfo) {
    dispatch({
      type: "loading",
      payload: { isLoading: true, totalFiles: files.length }
    });
    const dirPaths = [];
    const filesArr = [];
    dirPaths.push(repoInfo.restPath);
    mapFileAndDirectory(dirPaths, repoInfo, filesArr);
  }

  function downloadFile(file, repoInfo) {
    const zip = new JSZip();
    dispatch({
      type: "loading",
      payload: {
        isLoading: true,
        totalFiles: 1,
        downloadedFiles: 0
      }
    });
    axios.get(file, { type: "arraybuffer" }).then(
      buffer => {
        dispatch({
          type: "success",
          payload: {
            isLoading: false,
            downloadFiles: 1
          }
        });
        zip.file(repoInfo.rootName, buffer.data.data);
        zip.generateAsync({ type: "blob" }).then(content => {
          saveAs(content, repoInfo.downloadFileName + ".zip");
          window.history.pushState({}, null, "/");
        });
      },
      err => {
        console.log(err);
        dispatch({ type: "failure", payload: { isLoading: false } });
      }
    );
  }

  return (
    <div>
      <Form />
      <Loading {...state} />
    </div>
  );
};

export default DownGit;
